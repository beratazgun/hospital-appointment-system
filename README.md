<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Proje Tanıtımı

Bu proje, kullanıcıların randevu sistemi üzerinde kolay ve hızlı bir şekilde işlem yapmasını sağlayan **hastane randevu yönetim platformu**dur. Sistemde kimlik doğrulama, kullanıcı ve doktor işlemleri, e-posta bildirimleri, job yönetimi ve detaylı loglama gibi birçok temel işlev başarıyla entegre edilmiştir. CQRS pattern ve monorepo kullanarak geliştirilmiştir. Bu proje tamamıyla kişisel gelişim amacıyla hazırlanmış olup, gerçek bir hastane randevu yönetim platformu değildir.

### Teknolojiler

- **NestJS:**
- **Prisma:**
- **MongoDB:**
- **Docker:**
- **Rabbitmq:**
- **Nginx:**
- **Resend:**

### Veritabanı Tasarımı

![database-design](https://github.com/user-attachments/assets/a5bc61c5-3d53-4935-985a-15ec6642f152)


## Özellikler

### Kimlik Doğrulama

- ✅ **Üye olma:** Kullanıcılar hızlıca sisteme kayıt olabilir.
- ✅ **Üye girişi:** Güvenli oturum açma sağlanmıştır.
- ✅ **Şifremi unuttum:** Şifre sıfırlama adımları sunulmuştur.
- ✅ **Şifre güncelleme:** Kullanıcılar hesap şifrelerini kolayca güncelleyebilir.
- ✅ **Hesap onayı:** Üyelik sonrası e-posta onayı gerekmektedir.
- ✅ **Çıkış yapma:** Güvenli çıkış özelliği ile oturum sonlandırma sağlanır.

### Kullanıcı İşlemleri

- ✅ **Profil bilgilerini alma:** Kullanıcılar profil bilgilerini görüntüleyebilir.
- ✅ **Randevu bilgilerini alma:** Mevcut randevu detaylarına erişim sağlanır.

### Randevu Yönetimi

- ✅ **Randevu oluşturma:** Kullanıcılar hızlıca randevu planlayabilir.
- ✅ **Randevu iptal etme:** Randevular gerektiğinde iptal edilebilir.
- ✅ **Yaklaşan randevuyu onaylama:** Onay gerektiren randevular yönetilebilir.

### Doktor İşlemleri

- ✅ **Doktor listesi alma:** Tüm doktorların listesi sunulmuştur.
- ✅ **Doktor bilgilerini alma:** Doktorların detaylı profilleri görüntülenebilir.
- ✅ **Doktorun randevularını alma:** Her doktorun randevu programına erişim sağlanır.

### E-mail İşlemleri

- ✅ **Üye olduktan sonra e-mail gönderme:** Üyelik sonrası onay e-postası.
- ✅ **Hesap onayı sonrası e-mail gönderme:** Onay süreci tamamlanınca bildirim.
- ✅ **Randevu oluşturulunca e-mail gönderme:** Randevu başarıyla oluşturulduğunda.
- ✅ **Randevu iptali sonrası e-mail gönderme:** İptal durumunda bildirim.
- ✅ **Yaklaşan randevu için e-mail gönderme:** Hatırlatma e-postası gönderilir.
- ✅ **Şifre sıfırlama e-mail gönderme:** Şifre sıfırlama linki sağlanır.
- ✅ **şifre güncelleme sonrası e-mail gönderme:** Şifre güncelleme işlemi tamamlandığında.
- ✅ **Randevu sistem tarafından iptal edilince e-mail gönderme:** Sistem tarafından iptal edilen randevular için.

### JOB Yönetimi

- ✅ **15 günlük slot oluşturma:** Her 15 günde bir çalışan job, gelecekteki randevu slotlarını hazırlar.
- ✅ **Yaklaşan randevuları kontrol etme:** Saatlik çalışan job, randevuları izleyip kontrol eder.
- ✅ **Randevuların iptali:** Her gün saat 18:00’de çalışan job, gelinmeyen randevuları iptal eder.

### Loglama

- ✅ **Kullanıcı işlemleri loglama:** Tüm kullanıcı eylemleri kaydedilir.
- ✅ **Kimlik doğrulama işlemleri loglama:** Oturum açma ve çıkış işlemleri izlenir.
- ✅ **Randevu işlemleri loglama:** Randevu yönetimine dair işlemler kayıt altına alınır.
- ✅ **Doktor işlemleri loglama:** Doktorla ilgili operasyonlar takip edilir.
- ✅ **E-mail işlemleri loglama:** E-posta gönderim süreçleri izlenir.
- ✅ **Job işlemleri loglama:** Jobların çalışmaları kaydedilir.

### Arama

- ✅ **Doktor arama:** Kullanıcılar hızlıca doktor arayabilir ve detaylı bilgilere ulaşabilir.

### Filtreleme

- ✅ **Randevu filtreleme:** Kullanıcılar randevuları tarih, doktor, şehir, ilçe, hastane bilgilerine göre filtreleyebilir.

## **CLI Yapısı**

Sistemin önemli bir parçası olan **CLI** araçları, hem operasyonel işlemleri hızlandırmak hem de kod organizasyonunu sağlamak için kullanılır. CLI komutları, CQRS (Command Query Responsibility Segregation) için dosya oluşturma işlemleri ve Prisma komutlarını Docker container'larında çalıştırma gibi görevleri yerine getirir.

### CLI Dizin Yapısı

```shell
cli
├─ commands
│  ├─ base-command.ts            # Komutların temel sınıfı
│  ├─ commands-invoker.ts        # Komutları çağıran yapı
│  ├─ create-command-file.ts     # Komut dosyası oluşturma
│  ├─ create-event-file.ts       # Event dosyası oluşturma
│  ├─ create-model.ts            # Model oluşturma komutu
│  ├─ create-query-file.ts       # Query dosyası oluşturma
│  ├─ create-repository.ts       # Repository dosyası oluşturma
│  ├─ mongo-command.ts           # MongoDB işlemleri için komut
│  ├─ prisma-command.ts          # Prisma işlemleri için komut
│  └─ seed-command.ts            # Seed işlemi için komut
├─ helpers
│  └─ template-manager.ts        # Template yönetim fonksiyonları
├─ templates
│  ├─ aggregate.model.md         # Aggregate modeli şablonu
│  ├─ command-and-event.impl.md  # Komut ve event uygulama şablonu
│  ├─ command.handler.md         # Komut handler şablonu
│  ├─ event.handler.md           # Event handler şablonu
│  ├─ handler-index.md           # Handler index şablonu
│  ├─ query.handler.md           # Query handler şablonu
│  └─ repository.md              # Repository şablonu
├─ types
│  └─ cqrs-files.type.ts         # CQRS dosya türleri
└─ bootstrap.ts                  # CLI başlatma dosyası
```

### CLI Komutları

```bash
$ bash hascli.sh <keyword> <module_name> <file_name>
```

detayları için aşağıdaki komutlar kullanılabilir

```bash
$ bash hascli.sh --help
```

### Projeyi ayağı kaldırma

Proje, Docker container'larında çalıştırılmak üzere yapılandırılmıştır. Aşağıdaki adımları takip ederek projeyi başlatabilirsiniz.

### Gereksinimler

- Docker
- Docker Compose
- Node.js
- npm

### Projeyi başlatma

```bash
$ npm install

$ cp ./config/.env.example ./config/.env.development

$ docker-compose up --build
```
