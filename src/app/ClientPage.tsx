"use client";

import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { bodyHtml } from './bodyHtml';
import styles from './ClientPage.module.css';
import { getCountdownRemaining } from './campaign';

type FormData = { fullName: string; phone: string; email: string };
type Status = 'idle' | 'loading' | 'success' | 'error';
const LandingContent = memo(function LandingContent() { return <>{parse(bodyHtml)}</>; });
const POPUP_SCROLL_DISTANCE = 600;
const POPUP_COOLDOWN_MS = 15000;

function Countdown({ remaining, compact = false }: { remaining: number | null; compact?: boolean }) {
  if (remaining === null) return <span className={styles.openLabel}>Đăng ký miễn phí · Nhận lịch học qua Zalo</span>;
  const values = [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60];
  return <div className={`${styles.countdown} ${compact ? styles.compact : ''}`} role="timer" aria-label={`Đếm ngược: ${values[0]} giờ ${values[1]} phút ${values[2]} giây`}>
    {values.map((value, index) => <div className={styles.timeUnit} key={index}>
      <strong key={value}>{String(value).padStart(2, '0')}</strong><span>{['Giờ', 'Phút', 'Giây'][index]}</span>
    </div>)}
  </div>;
}

export default function ClientPage({ initialZaloLink = '' }: { initialZaloLink?: string }) {
  const [formData, setFormData] = useState<FormData>({ fullName: '', phone: '', email: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const prompted = useRef(false);
  const submitting = useRef(false);
  const lastPopupClosedAt = useRef(0);
  const hasZalo = /^https:\/\/zalo\.me\/.+/i.test(initialZaloLink);
  const openModal = useCallback(() => {
    prompted.current = true;
    try { sessionStorage.setItem('nga-registration-prompted', '1'); } catch { /* Storage may be unavailable. */ }
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    let startedAt = Date.now();
    try {
      const saved = Number(sessionStorage.getItem('nga-countdown-start'));
      if (Number.isFinite(saved) && saved > 0 && saved <= startedAt) startedAt = saved;
      else sessionStorage.setItem('nga-countdown-start', String(startedAt));
    } catch { /* The timer also works when session storage is unavailable. */ }
    const update = () => setRemaining(getCountdownRemaining(startedAt, Date.now()));
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(initial); clearInterval(interval); document.removeEventListener('visibilitychange', update); };
  }, []);

  useLayoutEffect(() => {
    if (!isModalOpen) return;
    const scrollPosition = { left: window.scrollX, top: window.scrollY };
    const root = document.documentElement;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousScrollBehavior = root.style.scrollBehavior;
    const modal = dialog.current;
    // Lock before native dialog autofocus and restore before the browser paints.
    root.style.scrollBehavior = 'auto';
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    modal?.showModal();
    window.scrollTo({ ...scrollPosition, behavior: 'instant' });
    return () => {
      lastPopupClosedAt.current = Date.now();
      modal?.close();
      document.body.style.overflow = previousOverflow;
      root.style.overflow = previousRootOverflow;
      previous?.focus({ preventScroll: true });
      window.scrollTo({ ...scrollPosition, behavior: 'instant' });
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen || status === 'success' || status === 'loading') return;
    try {
      if (sessionStorage.getItem('nga-registration-completed') === '1') return;
    } catch { /* Optional storage. */ }

    // Measure from the last dismissal; scrolling the dialog does not count.
    const scrollStart = window.scrollY;
    let opened = false;
    const canPrompt = () => !opened && !submitting.current && !document.hidden &&
      !document.activeElement?.matches('input, textarea, select, [contenteditable="true"]') &&
      Date.now() - lastPopupClosedAt.current >= POPUP_COOLDOWN_MS;
    const invite = () => {
      opened = true;
      openModal();
    };
    const onScroll = () => {
      if (window.scrollY - scrollStart >= POPUP_SCROLL_DISTANCE && canPrompt()) invite();
    };
    const timer = window.setTimeout(() => {
      let seen = prompted.current;
      try { seen = seen || sessionStorage.getItem('nga-registration-prompted') === '1'; } catch { /* Optional storage. */ }
      if (!seen && canPrompt()) invite();
    }, 25000);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isModalOpen, status, openModal]);

  useEffect(() => {
    const elements = content.current?.querySelectorAll('.c-image, .c-heading, .c-sub-heading, .c-bullet-list');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    elements?.forEach((element) => { element.classList.add(styles.reveal); observer.observe(element); });
    return () => { observer.disconnect(); elements?.forEach((element) => element.classList.remove(styles.reveal, styles.revealed)); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus('loading');
    setError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Không thể gửi đăng ký. Vui lòng thử lại.');
      }
      setStatus('success');
      try { sessionStorage.setItem('nga-registration-completed', '1'); } catch { /* Optional storage. */ }
      setFormData({ fullName: '', phone: '', email: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Mất kết nối. Vui lòng thử lại.');
    } finally { submitting.current = false; }
  };

  return <div className={styles.experience}>
    <div className={styles.announcement}>
      <span className={styles.liveDot} aria-hidden="true" />
      <span>THỬ THÁCH AFFILIATE 2 NGÀY</span>
      <button onClick={openModal}>Tham gia miễn phí <span aria-hidden="true">↗</span></button>
    </div>
    <div className={styles.ambient} aria-hidden="true"><i /><i /><i /></div>
    <div ref={content} className={styles.landing} onClick={(e) => {
      if ((e.target as HTMLElement).closest('.c-button button, [id^="button-"]')) { e.preventDefault(); openModal(); }
    }}><LandingContent /></div>

    <section className={styles.invitation} aria-label="Đăng ký tham gia">
      <span className={styles.eyebrow}>BƯỚC TIẾP THEO CỦA BẠN</span>
      <h2>Hẹn gặp bạn<br /><em>trong nhóm Zalo!</em></h2>
      <p>Đăng ký để nhận lịch học, tài liệu và cùng bắt đầu thử thách Affiliate 2 ngày.</p>
      <p className={styles.deadlineLabel}>Đừng trì hoãn, bắt đầu ngay hôm nay!</p>
      <Countdown remaining={remaining} />
      <button className={styles.submit} onClick={openModal}>Đăng ký & vào nhóm Zalo <span aria-hidden="true">↗</span></button>
      <div className={styles.benefits}><span>✓ 2 ngày học</span><span>✓ Tài liệu trong nhóm</span><span>✓ Miễn phí tham gia</span></div>
    </section>

    {!isModalOpen && <aside className={styles.dock} aria-label="Đăng ký nhanh">
      <div className={styles.dockCopy}><span className={styles.eyebrow}>ĐỪNG BỎ LỠ LỊCH HỌC</span><strong>Thử thách Affiliate 2 ngày</strong></div>
      <Countdown remaining={remaining} compact />
      <button className={styles.dockButton} onClick={openModal}>{status === 'success' ? 'Vào nhóm Zalo' : 'Đăng ký miễn phí'} <span aria-hidden="true">↗</span></button>
    </aside>}

    {isModalOpen && <dialog ref={dialog} className={styles.modal} aria-labelledby="nga-modal-title" onCancel={() => setIsModalOpen(false)} onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
      <div className={styles.modalInner}>
        <button className={styles.close} onClick={() => setIsModalOpen(false)} aria-label="Đóng">×</button>
        <div className={styles.steps}><span className={status !== 'success' ? styles.activeStep : ''}>01 · Đăng ký</span><i /><span className={status === 'success' ? styles.activeStep : ''}>02 · Vào nhóm Zalo</span></div>
        {status === 'success' ? <div className={styles.success}>
          <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
          <div className={styles.successIcon} aria-hidden="true">✓</div>
          <h2 id="nga-modal-title" className={styles.successTitle}>Bạn đã đăng ký thành công!</h2>
          <p className={styles.successText}>Còn một bước nữa: tham gia nhóm Zalo để nhận lịch học và tài liệu của thử thách.</p>
          {hasZalo ? <a className={styles.zaloButton} href={initialZaloLink} target="_blank" rel="noopener noreferrer">Vào nhóm Zalo ngay ↗</a> : <p className={styles.successNote}>Thông tin của bạn đã được lưu. Ban tổ chức sẽ liên hệ khi nhóm Zalo sẵn sàng.</p>}
          <p className={styles.successNote}>Lịch học và các thông báo sẽ được cập nhật trong nhóm.</p>
        </div> : <>
          <div className={styles.header}>
            <span className={styles.badge}>Lời mời dành cho bạn</span>
            <h2 id="nga-modal-title" className={styles.title}>{'Bắt đầu thử thách\nAffiliate 2 ngày'}</h2>
            <p className={styles.subtitle}>Điền thông tin, vào nhóm Zalo và nhận lịch học miễn phí.</p>
            <div className={styles.modalTimer}><span>Sẵn sàng bắt đầu cùng chúng tôi?</span><Countdown remaining={remaining} compact /></div>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field}><span className={styles.label}>Họ và tên</span><input className={styles.input} name="name" autoComplete="name" placeholder="Họ tên của bạn" required maxLength={100} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} /></label>
            <label className={styles.field}><span className={styles.label}>Số điện thoại Zalo</span><input className={styles.input} type="tel" name="tel" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" required maxLength={20} pattern="(?:0|\+84)[0-9 .\-]{9,14}" title="Số điện thoại Việt Nam, bắt đầu bằng 0 hoặc +84" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></label>
            <label className={styles.field}><span className={styles.label}>Email</span><input className={styles.input} type="email" name="email" autoComplete="email" placeholder="ban@gmail.com" required maxLength={254} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></label>
            <button type="submit" className={styles.submit} disabled={status === 'loading'}>{status === 'loading' ? 'Đang gửi đăng ký…' : 'Đăng ký miễn phí →'}</button>
            {status === 'error' && <div className={styles.error} role="alert">{error}</div>}
            <p className={styles.privacy}>Thông tin được dùng để liên hệ về chương trình. Sau khi đăng ký, bạn sẽ nhận liên kết vào nhóm Zalo.</p>
          </form>
        </>}
      </div>
    </dialog>}
  </div>;
}
