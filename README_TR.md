<p align="center">
    <img src="./src/logo.png">
</p>

<h1 align="center">ChatGPT Box</h1>

<div align="center">

Tarayıcınıza derin ChatGPT entegrasyonu, tamamen ücretsiz.


[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![size](https://img.shields.io/badge/minified%20size-390%20kB-blue)][release-url]
[![verfiy][verify-image]][verify-url]

[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md) &nbsp;&nbsp;|&nbsp;&nbsp; Türkçe

### Yükle

[![Chrome][Chrome-image]][Chrome-url]
[![Edge][Edge-image]][Edge-url]
[![Firefox][Firefox-image]][Firefox-url]
[![Safari][Safari-image]][Safari-url]
[![Android][Android-image]][Android-url]
[![Github][Github-image]][Github-url]

[Rehber](https://github.com/josStorer/chatGPTBox/wiki/Guide) &nbsp;&nbsp;|&nbsp;&nbsp; [Önizleme](#Preview) &nbsp;&nbsp;|&nbsp;&nbsp; [Gelişim ve Katkı Sağlama][dev-url] &nbsp;&nbsp;|&nbsp;&nbsp; [Video](https://www.youtube.com/watch?v=E1smDxJvTRs) &nbsp;&nbsp;|&nbsp;&nbsp; [Credit](#Credit)

[dev-url]: https://github.com/josStorer/chatGPTBox/wiki/Development&Contributing

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg

[license-url]: https://github.com/josStorer/chatGPTBox/blob/master/LICENSE

[release-image]: https://img.shields.io/github/release/josStorer/chatGPTBox.svg

[release-url]: https://github.com/josStorer/chatGPTBox/releases/latest

[verify-image]: https://github.com/josStorer/chatGPTBox/workflows/verify-configs/badge.svg

[verify-url]: https://github.com/josStorer/chatGPTBox/actions/workflows/verify-configs.yml

[Chrome-image]: https://img.shields.io/badge/-Chrome-brightgreen?logo=google-chrome&logoColor=white

[Chrome-url]: https://chrome.google.com/webstore/detail/chatgptbox/eobbhoofkanlmddnplfhnmkfbnlhpbbo

[Edge-image]: https://img.shields.io/badge/-Edge-blue?logo=microsoft-edge&logoColor=white

[Edge-url]: https://microsoftedge.microsoft.com/addons/detail/fission-chatbox-best/enjmfilpkbbabhgeoadmdpjjpnahkogf

[Firefox-image]: https://img.shields.io/badge/-Firefox-orange?logo=firefox-browser&logoColor=white

[Firefox-url]: https://addons.mozilla.org/firefox/addon/chatgptbox/

[Safari-image]: https://img.shields.io/badge/-Safari-blue?logo=safari&logoColor=white

[Safari-url]: https://apps.apple.com/app/fission-chatbox/id6446611121

[Android-image]: https://img.shields.io/badge/-Android-brightgreen?logo=android&logoColor=white

[Android-url]: https://github.com/josStorer/chatGPTBox/wiki/Install#install-to-android

[Github-image]: https://img.shields.io/badge/-Github-black?logo=github&logoColor=white

[Github-url]: https://github.com/josStorer/chatGPTBox/wiki/Install

#### Yeni projem olan [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) yayında, tek tıkla deploy edilebilen açık kaynaklı, ChatGPTBox ile birlikte kullanılabilen, ticari amaçlarla kullanılabilen, tek tıklamayla deploy edilebilir açık kaynaklı büyük dil modeli aracı.

</div>

## Bilgilendirme

- Bu eklenti hiçbir verinizi **toplamaz**. Kod içinde network isteği çağrılarını bulmak için `fetch(` ve `XMLHttpRequest(` için global bir arama yaparak bunu doğrulayabilirsiniz. Kod miktarı fazla değil, bu yüzden yapılması kolaydır.

- Bu araç ChatGPT'ye siz açıkça belirtmediğiniz sürece hiçbir veri iletmez. Varsayılan olarak, eklentinin manuel olarak aktif hale getirilmesi gerekmektedir. Özellikle, sadece "ChatGPT'ye Sor" butonuna basarsanız ChatGPT'ye istek atar veya yüzen seçim araçlarını tetiklerseniz — Bu yalnızca GPT API modlarını kullandığınızda uygulanır (konu #407)

- Cloudflare korumasını geçmek için gelişmiş ayarlardan ücretsiz ters proxy'i kurabilirsiniz: https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy

- Offline/Self-host'lu modeller (RWKV, llama.cpp, ChatGLM) artık destekleniyor, Bknz: https://github.com/josStorer/selfhostedAI

## ✨ Özellikler

- 🌈 Sohbet diyalog kutusunu istediğiniz zaman çağırma. (<kbd>Ctrl</kbd>+<kbd>B</kbd>)
- 📱 Mobil cihaz desteği.
- 📓 Herhangi bir sayfayı sağ tık menüsüyle özetleme (<kbd>Alt</kbd>+<kbd>B</kbd>)
- 📖 Bağımsız konuşma sayfası. (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd>)
- 🔗 Çoklu API desteği (Ücretsiz ve Plus kullanıcıları için Web API , GPT-3.5, GPT-4, New Bing, Self-Hosted, Azure, Poe vs.).
- 📦 Çeşitli olarak yaygın kullanılan websiteler için entegrasyon (Reddit, Quora, YouTube, GitHub, GitLab, StackOverflow, Zhihu, Bilibili). ([wimdenherder](https://github.com/wimdenherder)'den esinlenilmiştir)
- 🔍 Tüm popüler arama motorlarına entegrasyon ve ek siteleri desteklemek için özel sorgu desteği 
- 🧰 Çeşitli görevleri yerine getirmek için, seçim aracı ve sağ tık menüsü (Çeviri, Özetleme,Polishing, Duygu Analizi, Paragraf Bölme, Kod Açıklama ve Sorgular gibi.)
- 🗂️ Çok dallı konuşmalar için statik yüzen kart kutuları desteği.
- 🖨️ Kolaylıkla tam sohbet kayıtlarınızı kaydedin veya kısmi olarak kopyalayın.
- 🎨 Güçlü render'lama desteği, ister kod için olsun ister karışık matematik formülleri için.
- 🌍 Dil tercih desteği.
- 📝 Özel API adres desteği.
- ⚙️ Tüm site adaptasyonları ve seçim araçları(sohbet balonu) özgürce açıp kapatılabilir, ihtiyacınız olmayan modülleri kapatın.
- 💡 Seçim araçları ve site adaptasyonunun geliştirilmesi kolay ve geniştir, [Development&Contributing][dev-url] bölümüne bakınız.
- 😉 Yanıt kalitesini artırmak için sohbet edin.

## Önizleme

<div align="center">

**Arama Motoru Entegrasyonu, Yüzen Pencereler, Konuşma Dalları**

![preview_google_floatingwindow_conversationbranch](screenshots/preview_google_floatingwindow_conversationbranch.jpg)

**Yaygın Olarak Kullanılan Sitelerle Entegrasyon, Seçim Araçları**

![preview_reddit_selectiontools](screenshots/preview_reddit_selectiontools.jpg)

**Bağımsız Konuşma Sayfası**

![preview_independentpanel](screenshots/preview_independentpanel.jpg)

**Git Analizi, Sağ Tık Menüsü**

![preview_github_rightclickmenu](screenshots/preview_github_rightclickmenu.jpg)

**Video Özeti**

![preview_youtube](screenshots/preview_youtube.jpg)

**Mobil Desteği**

![image](https://user-images.githubusercontent.com/13366013/225529110-9221c8ce-ad41-423e-b6ec-097981e74b66.png)

**Ayarlar**

![preview_settings](screenshots/preview_settings.jpg)

</div>

## Katkıda Bulunanlar

Bu proje diğer repolarımın birisinden baz alınmıştır.
[josStorer/chatGPT-search-engine-extension](https://github.com/josStorer/chatGPT-search-engine-extension)

[josStorer/chatGPT-search-engine-extension](https://github.com/josStorer/chatGPT-search-engine-extension) projesi [wong2/chat-gpt-google-extension](https://github.com/wong2/chat-gpt-google-extension) projesinden "fork"lanmıştır (Ondan çok şey öğrendim)
ve 14 Aralık 2022'den beri bağımsızım

[wong2/chat-gpt-google-extension](https://github.com/wong2/chat-gpt-google-extension) projesi [ZohaibAhmed/ChatGPT-Google](https://github.com/ZohaibAhmed/ChatGPT-Google) ([upstream-c54528b](https://github.com/wong2/chatgpt-google-extension/commit/c54528b0e13058ab78bfb433c92603db017d1b6b)) projesinden esinlenilmiştir
