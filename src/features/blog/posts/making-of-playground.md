---
title: Hậu trường: Xây dựng zTool Playground không cần Database
date: Dec 22, 2025
tag: Tech Deep Dive
readTime: 5 min read
slug: making-of-playground
relatedTool: web-playground
---

<p>Xuất phát từ ý tưởng, tôi luôn muốn có một nơi để test nhanh ý tưởng HTML/CSS/JS mà không cần mở VS Code, không cần tạo file, không cần setup server. Dùng Codepen hay JSFiddle rất tuyệt, nhưng chúng quá nặng nề cho nhu cầu "mì ăn liền". Và quan trọng hơn: <strong>Tôi muốn sở hữu nó, tôi muốn có 1 cách riêng mới lại để share short demo ấn tượng mang đầy dấu ấn cá nhân.</strong></p>

<img src="https://i.imgur.com/placeholer-playground.png" alt="Playground Preview" style="background:#333; height: 300px; display:flex; align-items:center; justify-content:center; color:#666;" />

<h2>Thách thức 1: Editor xịn trên Web</h2>
<p>Dùng <code>textarea</code> thì quá "phèn". Tôi cần syntax highlighting, auto-complete. Giải pháp là <strong>Monaco Editor</strong> - trái tim của VS Code. Tuy nhiên, việc tích hợp Monaco vào môi trường SSG (Static Site Generator) là một cơn ác mộng nhỏ với việc load cái file Worker. Tôi đã phải dùng mánh load qua CDN và cấu hình <code>require.config</code> thủ công.</p>

<h2>Thách thức 2: Chạy code an toàn</h2>
<p>Cho user chạy code JS ngay trên browser của mình là rủi ro bảo mật lớn. Giải pháp? <strong>Iframe Sandbox</strong>. Chúng ta tạo một iframe, ném code vào <code>srcdoc</code>, và cô lập nó bằng thuộc tính <code>sandbox="allow-scripts"</code>. Nó giống như nhốt con hổ vào lồng kính vậy.</p>

<h2>Thách thức 3: Chia sẻ không cần Database (Đây là phần tôi tâm đắc nhất) 😎</h2>
<p>Làm sao để bạn code xong, bấm Share, gửi link cho bạn bè mà server của tôi không tốn 1 byte lưu trữ?</p>

<p>Câu trả lời là: <strong>URL Hash & LZ-String</strong>.</p>

<ul>
    <li>B1: Lấy toàn bộ code HTML/CSS/JS.</li>
    <li>B2: Gom thành 1 object JSON.</li>
    <li>B3: Nén chuỗi JSON đó bằng thuật toán LZW (thư viện <code>lz-string</code>).</li>
    <li>B4: Gắn chuỗi nén vào sau dấu <code>#</code> của URL.</li>
</ul>

<pre><code>// Demo Logic
const data = JSON.stringify({ html, css, js });
const compressed = LZString.compressToEncodedURIComponent(data);
window.location.hash = 'code=' + compressed;</code></pre>

<p>Kết quả là một cái link trông hơi dài một chút, nhưng nó chứa đựng <strong>toàn bộ</strong> source code của bạn. Server không biết gì cả. Privacy tuyệt đối. Free tuyệt đối.</p>

<h2>Kết luận & Trải nghiệm</h2>
<p>Đôi khi, giải pháp tốt nhất không phải là công nghệ phức tạp nhất (như Docker, Microservices), mà là giải pháp thông minh nhất. <strong>zTool Playground</strong> là minh chứng cho việc bạn có thể làm được những tool cực mạnh chỉ với Static Web.</p>

<div class="card" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-hover);">
    <h3 style="margin-top: 0;">✨ Examples Nổi bật</h3>
    <p>Tôi đã dựng sẵn vài demo để bạn thấy sức mạnh của nó:</p>
    <ul>
        <li><a href="/web-playground/examples/todo/">👉 <strong>Advanced Todo App</strong></a>: CRUD, Filter, Stats (như ảnh demo).</li>
        <li><a href="/web-playground/examples/bst-visualizer/">🌳 <strong>B-Tree Visualizer</strong></a>: Trực quan hóa cấu trúc dữ liệu.</li>
    </ul>
</div>

<p style="margin-top: 3rem; font-style: italic; border-left: 3px solid #666; padding-left: 1rem;">
    Hãy thử ngay: <a href="/web-playground/" style="color: #61dafb; text-decoration: none;">🚀 Mở zTool Playground IDE</a>
</p>
