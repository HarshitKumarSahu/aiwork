# 🧠 AI.Work – Your AI-Powered Pinterest Clone

AI.Work is a full-stack web application inspired by Pinterest, where users can register, log in, generate AI-powered images using the ClipDrop API, and manage their posts. Images are stored and served via Cloudinary for fast, reliable, and scalable delivery.

---

## 🚀 Features

- 🔐 **User Authentication** (Register/Login/Logout with Passport.js)
- 📸 **AI Image Generation** using [ClipDrop API](https://clipdrop.co/apis)
- ☁️ **Image Upload & Storage** via [Cloudinary](https://cloudinary.com/)
- 🖼️ **Pinterest-like Feed** with user-generated posts
- 👤 **Profile Management** with profile image support
- 🧾 **EJS Templating** with responsive views
- 🌐 **MongoDB Atlas** for cloud database
- 💡 **Post Editing & Deletion** (with Cloudinary cleanup)

---

## 📁 Tech Stack

### 💻 Frontend
- EJS (Embedded JavaScript templates)
- HTML, CSS, GSAP, SplitType

### 🛠️ Backend
- Node.js
- Express.js
- Passport.js for authentication
- MongoDB with Mongoose
- Multer + Cloudinary for file uploads

### ☁️ APIs & Tools
- ClipDrop API (Text-to-Image Generation)
- Cloudinary (Image hosting)
- MongoDB Atlas (Cloud DB)
- dotenv, UUID, Streamifier, Express-Session, and more

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/HarshitKumarSahu/aiwork.git
cd aiwork
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Create a `.env` File

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MONGO_URI=your_mongodb_atlas_connection_string
CLIPDROP_API_KEY=your_clipdrop_api_key
SESSION_SECRET=your_secret_session_key
```

### 4. Run the Project

```bash
npm start
```

The server runs at `http://localhost:3000` by default.

---

## 📦 Scripts

```bash
npm start        # Starts the Express server (entry: ./bin/www)
```

---

## 🧪 Example Features

- 🌄 **AI Image Generation**: `/generate`
- 📤 **Upload a Post**: `/upload`
- 🧑‍💻 **User Profile**: `/profile`
- 🖼️ **Image Feed**: `/feed`

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Harshit Kumar Sahu**  
🔗 [LinkedIn](https://www.linkedin.com/in/harshitkumarsahu-14082004aug/)  

---

## 🌟 Show Your Support

If you liked the project:

- ⭐ Star the repo
- 🐛 Report issues
- 📤 Share with your friends