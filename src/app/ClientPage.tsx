"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import styles from "./ClientPage.module.css";

type FormData = { fullName: string; phone: string };
type Status = "idle" | "loading" | "success" | "error";

const situations = [
  "Muốn có thêm nguồn thu nhập nhưng chưa biết bắt đầu từ đâu.",
  "Đã từng bán hàng online nhưng chưa đạt kết quả như mong muốn.",
  "Chưa tự tin khi sử dụng AI hoặc các công cụ hỗ trợ kinh doanh.",
  "Muốn tìm hiểu một công việc linh hoạt, có thể bắt đầu với điện thoại.",
  "Cần một lộ trình cơ bản thay vì tự tìm hiểu rời rạc trên Internet.",
];

const affiliateUses = [
  "Xác định nhóm khách hàng phù hợp.",
  "Lựa chọn sản phẩm hoặc dịch vụ để giới thiệu.",
  "Xây dựng nội dung chia sẻ.",
  "Quản lý thông tin và theo dõi kết quả.",
  "Tự động hóa một phần quy trình chăm sóc khách hàng.",
];

const sessionOne = [
  "Affiliate Marketing là gì và hoa hồng được tạo ra như thế nào.",
  "Mô hình này khác gì so với việc tự nhập hàng hoặc tự sản xuất sản phẩm.",
  "Các tiêu chí cơ bản để lựa chọn sản phẩm và khách hàng phù hợp.",
  "Những công cụ có thể hỗ trợ quá trình tạo nội dung và quản lý công việc.",
  "Các sai lầm, rủi ro và vấn đề cần lưu ý khi mới bắt đầu.",
];

const sessionTwo = [
  "Xây dựng hình ảnh cá nhân phù hợp với lĩnh vực lựa chọn.",
  "Tạo nội dung chia sẻ có ích và đúng với nhu cầu người xem.",
  "Ứng dụng AI, Zalo và một số công cụ hỗ trợ trong công việc.",
  "Sắp xếp quy trình theo dõi và chăm sóc khách hàng.",
  "Lập kế hoạch học tập, thực hành trong 30–60 ngày tiếp theo.",
];

const suitableFor = [
  "Người nội trợ muốn tìm hiểu thêm một hướng tạo thu nhập.",
  "Người đi làm muốn khám phá nguồn thu nhập thứ 2.",
  "Người trung niên chưa tự tin với công nghệ.",
  "Người từng kinh doanh online nhưng muốn làm bài bản hơn.",
  "Người mới muốn tìm hiểu Affiliate từ những khái niệm cơ bản.",
];

const goalFactors = [
  "Mức độ hiểu biết và khả năng thực hành.",
  "Thời gian bạn có thể dành cho công việc.",
  "Lĩnh vực và sản phẩm bạn lựa chọn.",
  "Chất lượng nội dung và cách tiếp cận khách hàng.",
  "Chính sách của từng chương trình Affiliate.",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className={styles.checkList}>
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true">✓</span>
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

export default function ClientPage({ initialZaloLink = "" }: { initialZaloLink?: string }) {
  const [formData, setFormData] = useState<FormData>({ fullName: "", phone: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const hasZalo = /^https:\/\/zalo\.me\/.+/i.test(initialZaloLink);

  const scrollToRegister = useCallback(() => {
    document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;

    submitting.current = true;
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Không thể gửi đăng ký. Vui lòng thử lại.");
      }

      setStatus("success");
      setFormData({ fullName: "", phone: "" });
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Mất kết nối. Vui lòng thử lại.");
    } finally {
      submitting.current = false;
    }
  };

  return (
    <div id="top" className={styles.experience}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="Nga Leader — về đầu trang">
          <span>N</span><strong>Nga Leader</strong>
        </a>
        <p>2 buổi hướng dẫn hoàn toàn miễn phí</p>
        <button onClick={scrollToRegister}>Đăng ký ngay <span aria-hidden="true">↗</span></button>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Affiliate từ cơ bản đến thực hành</span>
            <h1>Không giỏi công nghệ?<br /><em>Bạn vẫn có thể bắt đầu.</em></h1>
            <p className={styles.heroLead}>Tìm hiểu cách tạo thêm thu nhập với Affiliate Marketing theo từng bước rõ ràng — chỉ với một chiếc điện thoại có kết nối Internet.</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton} type="button" onClick={scrollToRegister}>Đăng ký 2 buổi miễn phí <span aria-hidden="true">→</span></button>
              <a className={styles.textLink} href="#chuong-trinh">Xem nội dung 2 buổi <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.heroNotes}>
              <span>✓ Dành cho người mới</span>
              <span>✓ Học qua điện thoại</span>
              <span>✓ Không cam kết thu nhập</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.portraitFrame}>
              <Image src="/ta-thi-nga.jpg" alt="Chị Nga, người chia sẻ chương trình tìm hiểu Affiliate" width={800} height={1200} sizes="(max-width: 900px) 78vw, 420px" preload />
            </div>
            <div className={styles.personalNote}>
              <span>Trải nghiệm cá nhân</span>
              <strong>60 ngày</strong>
              <p>học hỏi và thực hành nghiêm túc</p>
            </div>
          </div>
        </section>

        <section className={styles.introStrip} aria-label="Thông điệp chương trình">
          <p>Bạn không cần biết mọi thứ ngay từ đầu.</p>
          <strong>Điều quan trọng là sẵn sàng học hỏi, thực hành và tự đánh giá mô hình có phù hợp với mình hay không.</strong>
        </section>

        <section className={`${styles.section} ${styles.situationSection}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>01</span>
            <div><span className={styles.eyebrow}>Bắt đầu từ hoàn cảnh của bạn</span><h2>Bạn có đang ở trong<br />hoàn cảnh này?</h2></div>
          </div>
          <div className={styles.situationGrid}>
            {situations.map((item, index) => <article className={styles.situationCard} key={item}><span>0{index + 1}</span><p>{item}</p></article>)}
          </div>
          <p className={styles.sectionConclusion}>Nếu bạn đang ở một trong những hoàn cảnh trên, 2 buổi miễn phí có thể giúp bạn hiểu rõ hơn về Affiliate và những bước đầu tiên cần chuẩn bị.</p>
        </section>

        <section className={`${styles.section} ${styles.storySection}`}>
          <div className={styles.storyCopy}>
            <span className={styles.eyebrow}>02 · Câu chuyện của tôi</span>
            <h2>“Tôi từng nghĩ mình<br />không thể bắt đầu.”</h2>
            <p>Xin chào, tôi là Nga. Tôi từng là một người mẹ nội trợ và không có nhiều kinh nghiệm về công nghệ.</p>
            <p>Trước đây, tôi nghĩ kiếm tiền online, AI hay Affiliate chỉ phù hợp với những người trẻ và giỏi máy tính. Tôi muốn có thêm thu nhập nhưng lo rằng mình sẽ không thể bắt đầu.</p>
            <p>Sau khi biết đến Affiliate Marketing — tiếp thị liên kết, tôi bắt đầu học từng bước: sử dụng điện thoại, xây dựng nội dung và làm quen với các công cụ hỗ trợ.</p>
            <p>Sau 60 ngày học hỏi và thực hành nghiêm túc, tôi đã tạo được nguồn thu nhập thứ 2 cho mình.</p>
            <aside className={styles.disclaimer}>
              <strong>Lưu ý về kết quả</strong>
              <p>Đây là trải nghiệm cá nhân của tôi, không phải cam kết rằng mọi người đều sẽ đạt kết quả tương tự trong cùng một khoảng thời gian. Kết quả còn phụ thuộc vào kiến thức, thời gian, cách triển khai và mức độ nỗ lực của mỗi người.</p>
            </aside>
            <blockquote>Bạn không nhất thiết phải giỏi công nghệ mới có thể bắt đầu. Bạn cần một phương pháp dễ hiểu, hướng dẫn phù hợp và sự kiên trì để từng bước thực hành.</blockquote>
          </div>
        </section>

        <section className={`${styles.section} ${styles.modelSection}`}>
          <div className={styles.modelIntro}>
            <span className={styles.eyebrow}>03 · Hiểu đúng mô hình</span>
            <h2>Affiliate Marketing<br />hoạt động như thế nào?</h2>
            <p>Affiliate Marketing là hình thức bạn giới thiệu sản phẩm hoặc dịch vụ của doanh nghiệp thông qua một đường liên kết riêng. Khi có người mua hàng hợp lệ qua liên kết đó, bạn có thể nhận được hoa hồng theo chính sách của chương trình.</p>
          </div>
          <div className={styles.flow} aria-label="Quy trình Affiliate Marketing">
            <div><span>01</span><strong>Chọn sản phẩm</strong></div><i aria-hidden="true">→</i>
            <div><span>02</span><strong>Chia sẻ liên kết</strong></div><i aria-hidden="true">→</i>
            <div><span>03</span><strong>Đơn hàng hợp lệ</strong></div><i aria-hidden="true">→</i>
            <div><span>04</span><strong>Nhận hoa hồng</strong></div>
          </div>
          <div className={styles.techPanel}>
            <div><span className={styles.miniLabel}>Công nghệ có thể hỗ trợ</span><h3>Làm việc rõ ràng và tiết kiệm thời gian hơn</h3><p>Trong quá trình học, bạn có thể tìm hiểu cách ứng dụng công nghệ vào từng phần việc cụ thể.</p></div>
            <CheckList items={affiliateUses} />
          </div>
          <p className={styles.caution}>Công nghệ có thể giúp tiết kiệm thời gian, nhưng không thay thế việc học, kiểm chứng thông tin và chủ động thực hiện của bạn.</p>
        </section>

        <section id="chuong-trinh" className={`${styles.section} ${styles.programSection}`}>
          <div className={styles.centerHeading}><span className={styles.eyebrow}>04 · Nội dung chương trình</span><h2>Bạn sẽ nhận được gì<br />sau 2 buổi miễn phí?</h2></div>
          <div className={styles.sessionGrid}>
            <article className={styles.sessionCard}>
              <div className={styles.sessionHeader}><span>Buổi 1</span><h3>Hiểu đúng<br />về Affiliate</h3></div>
              <CheckList items={sessionOne} />
              <p className={styles.sessionResult}><strong>Sau buổi 1:</strong> Bạn có cơ sở để đánh giá Affiliate có phù hợp với mục tiêu và điều kiện của mình hay không.</p>
            </article>
            <article className={`${styles.sessionCard} ${styles.sessionCardAccent}`}>
              <div className={styles.sessionHeader}><span>Buổi 2</span><h3>Xác định cách<br />bắt đầu</h3></div>
              <CheckList items={sessionTwo} />
              <p className={styles.sessionResult}><strong>Sau buổi 2:</strong> Bạn có thể hình dung rõ hơn về các bước cần làm và những kỹ năng cần tiếp tục rèn luyện.</p>
            </article>
          </div>
          <p className={styles.programNote}>Hai buổi tập trung vào kiến thức nền tảng và định hướng thực hành. Đây không phải chương trình cam kết thu nhập hay bảo đảm kết quả trong một khoảng thời gian cố định.</p>
        </section>

        <section className={`${styles.section} ${styles.fitSection}`}>
          <div className={styles.fitCopy}>
            <span className={styles.eyebrow}>05 · Ai có thể tham gia?</span>
            <h2>Chương trình này<br />có phù hợp với bạn?</h2>
            <p>Chương trình được thiết kế cho người mới muốn tìm hiểu Affiliate từ những điều cơ bản, rõ ràng và có thể thực hành từng bước.</p>
            <div className={styles.requirement}><span aria-hidden="true">⌁</span><p>Bạn chỉ cần có <strong>điện thoại kết nối Internet</strong> và sẵn sàng dành thời gian học, thực hành.</p></div>
          </div>
          <div className={styles.audienceList}>{suitableFor.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
        </section>

        <section className={`${styles.section} ${styles.goalSection}`}>
          <div className={styles.goalTitle}><span className={styles.eyebrow}>06 · Kỳ vọng thực tế</span><h2>Mục tiêu<br /><em>30 triệu/tháng</em><br />có phù hợp với bạn?</h2></div>
          <div className={styles.goalCopy}>
            <p className={styles.leadParagraph}>30 triệu đồng mỗi tháng có thể là một mục tiêu tài chính, nhưng không phải mức thu nhập được bảo đảm cho tất cả mọi người.</p>
            <p>Để tiến tới bất kỳ mục tiêu nào, bạn cần xây dựng kiến thức, kỹ năng, nội dung, hệ thống và tệp khách hàng phù hợp. Quá trình này có thể cần thời gian và sẽ phụ thuộc vào nhiều yếu tố:</p>
            <CheckList items={goalFactors} />
            <div className={styles.realityCheck}><strong>Không có kết quả tự động sau một đêm.</strong><p>2 buổi miễn phí giúp bạn hiểu mô hình và biết cách bắt đầu, còn kết quả thực tế phụ thuộc vào quá trình học hỏi và hành động của bạn.</p></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.startSection}`}>
          <span className={styles.eyebrow}>07 · Bắt đầu bằng một bước nhỏ</span>
          <h2>Kỹ năng có thể được<br /><em>rèn luyện từng bước.</em></h2>
          <p>Tôi từng lo lắng vì không biết công nghệ và không biết mình có làm được hay không. Nhưng việc bắt đầu từ những kiến thức cơ bản đã giúp tôi hiểu rằng kỹ năng có thể được rèn luyện từng bước.</p>
          <div className={styles.outcomes}><span>Hiểu đúng về mô hình</span><span>Biết những việc cần chuẩn bị</span><span>Nhận diện rủi ro và kỳ vọng thực tế</span><span>Xác định bước tiếp theo phù hợp</span></div>
          <p className={styles.noPressure}>Bạn không cần quyết định ngay. Hãy tham gia, đặt câu hỏi và tự đánh giá sau khi đã có thêm thông tin.</p>
          <button className={styles.primaryButton} type="button" onClick={scrollToRegister}>Đăng ký tham gia miễn phí <span aria-hidden="true">→</span></button>
        </section>

        <section id="dang-ky" className={styles.registrationSection}>
          <div className={styles.registrationCopy}>
            <span className={styles.eyebrow}>Đăng ký tham gia miễn phí</span>
            <h2>Hẹn gặp bạn trong<br />2 buổi hướng dẫn.</h2>
            <p>Điền thông tin để nhận lịch học và đường link tham gia qua Zalo.</p>
            <div className={styles.registrationBenefits}><span><i>✓</i> 2 buổi học miễn phí</span><span><i>✓</i> Nội dung dành cho người mới</span><span><i>✓</i> Thông tin lịch học qua Zalo</span></div>
          </div>
          <div className={styles.formCard}>
            {status === "success" ? (
              <div className={styles.success} role="status">
                <span className={styles.successIcon} aria-hidden="true">✓</span><h3>Đăng ký thành công!</h3>
                <p>Thông tin của bạn đã được ghi nhận. Lịch học và đường link tham gia sẽ được gửi qua Zalo.</p>
                {hasZalo && <a href={initialZaloLink} target="_blank" rel="noopener noreferrer">Vào nhóm Zalo <span aria-hidden="true">↗</span></a>}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label><span>Họ và tên</span><input name="name" autoComplete="name" placeholder="Nhập họ tên" required maxLength={100} value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} /></label>
                <label><span>Số điện thoại / Zalo</span><input type="tel" name="tel" inputMode="tel" autoComplete="tel" placeholder="Nhập số điện thoại" required maxLength={20} pattern="(?:0|\+84)[0-9 .\-]{9,14}" title="Số điện thoại Việt Nam, bắt đầu bằng 0 hoặc +84" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} /></label>
                <button type="submit" className={styles.formButton} disabled={status === "loading"}>{status === "loading" ? "Đang gửi đăng ký…" : "Đăng ký 2 buổi miễn phí →"}</button>
                {status === "error" && <p className={styles.formError} role="alert">{error}</p>}
                <p className={styles.privacy}>Thông tin chỉ được dùng để liên hệ về chương trình và gửi lịch học.</p>
              </form>
            )}
          </div>
        </section>

        <section className={styles.finalQuote}><blockquote>“Tôi không hứa giúp bạn kiếm 30 triệu sau 2 tháng. Tôi muốn chia sẻ cách bắt đầu, những kỹ năng cần học và các bước thực hành để bạn có thể tự đánh giá cơ hội tạo thêm thu nhập cho mình.”</blockquote><p>Nga — Đồng hành cùng bạn trong quá trình tìm hiểu Affiliate và phát triển kỹ năng kinh doanh online.</p></section>
      </main>

      <footer className={styles.footer}><a href="https://ngaleader.com">ngaleader.com</a><span>© 2026 Nga Leader</span></footer>
      <aside className={styles.mobileDock} aria-label="Đăng ký nhanh"><div><span>2 buổi miễn phí</span><strong>Tìm hiểu Affiliate từ cơ bản</strong></div><button type="button" onClick={scrollToRegister}>Đăng ký <span aria-hidden="true">→</span></button></aside>
    </div>
  );
}
