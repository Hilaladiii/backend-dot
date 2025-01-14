## Alasan Menggunakan Arsitektur Tersebut dalam Aplikasi Backend dengan NestJS

Saya menggunakan arsitektur tersebut untuk menjaga kerapihan, keteraturan, dan skalabilitas dalam pengembangan aplikasi. Struktur tersebut akan memudahkan dalam pengelolaan kode, berikut alasannya:

### 1. Commons

Folder ini berisi elemen-elemen umum seperti decorator, types, dan utils yang sering digunakan di berbagai modul. Dengan menempatkan elemen ini di satu tempat, saya dapat menghindari duplikasi kode dan memastikan konsistensi dalam penerapan utilitas di seluruh aplikasi.

### 2. Modules

Saya memisahkan setiap fitur utama aplikasi, seperti `user`, `auth`, `comment`, dan `post`, ke dalam modul-modul yang terpisah. Hal ini memungkinkan modularitas dan isolasi kode, sehingga setiap modul dapat dikembangkan, diuji, dan dikelola secara independen. Arsitektur berbasis modul ini juga mempermudah penambahan atau perubahan fitur tanpa mempengaruhi bagian lain dari aplikasi.

### 3. Provider

Semua provider yang memiliki decorator `@Injectable` diletakkan di folder ini untuk memisahkan logika bisnis dari logika aplikasi lainnya hal teresbut membantu menjaga single responsibility principle dan meningkatkan reusability dari provider tersebut di berbagai modul.

Arsitektur ini dirancang untuk meningkatkan maintainability dan scalability aplikasi, serta memudahkan kolaborasi di tim dengan memisahkan tanggung jawab yang jelas di setiap bagian aplikasi.

### Dokumentasi : https://documenter.getpostman.com/view/36195831/2sAYJ6DLVc#4f6c3b85-e88e-4849-93e5-c388fbca3a21
