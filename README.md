# Alumni Nexus: Rajasthan Connect

**Alumni Nexus: Rajasthan Connect** is a modern web application designed to foster meaningful connections between alumni and current students of Rajasthan-based educational institutions. Built with a focus on community engagement, mentorship, and professional networking, this platform serves as a centralized hub for alumni interactions and institutional updates.


> 🚀 Live Demo: https://deluxe-gnome-b65fd6.netlify.app/

---

## 🧩 Features

- **User Authentication**: Secure sign-up and login functionalities for alumni and students.
- **Profile Management**: Personalized dashboards for users to manage their profiles and view others'.
- **Alumni Directory**: Searchable database of alumni with filtering options based on batch, department, and location.
- **Event Management**: Creation and promotion of alumni events, reunions, and webinars.
- **Messaging System**: Direct messaging feature to facilitate communication between users.
- **Admin Panel**: Administrative interface for managing users, events, and content.

---

## 🛠️ Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (Authentication, Database, and Storage)
- **Package Manager**: [Bun](https://bun.sh/)
- **Version Control**: [Git](https://git-scm.com/) & [GitHub](https://github.com/)

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/docs/installation)
- [Supabase Account](https://supabase.com/) with a configured project

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ani811625/Alumni-Nexus.git
   cd Alumni-Nexus
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Configure Supabase:**

   - Rename `.env.example` to `.env`.
   - Add your Supabase project URL and API key:

     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Start the development server:**

   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # Supabase and API services
│   └── utils/          # Utility functions
├── supabase/           # Supabase configuration and SQL scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 🚀 Deployment

To deploy the application:

1. **Build the project:**

   ```bash
   bun run build
   ```

2. **Deploy to your preferred hosting service:**

   - **Vercel**: [https://vercel.com/](https://vercel.com/)
   - **Netlify**: [https://www.netlify.com/](https://www.netlify.com/)
   - **GitHub Pages**: [https://pages.github.com/](https://pages.github.com/)

Ensure that your environment variables are correctly set in the hosting platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes:**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a pull request.**

Please ensure your code adheres to the project's coding standards and includes relevant tests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For any inquiries or feedback:

- **Email**: [aniruddhas387@example.com](mailto:aniruddhas387@example.com)
- **LinkedIn**: [Aniruddha Sarkar](https://www.linkedin.com/in/aniruddha-sarkar-90a34334b/)

---

## 🙌 Acknowledgements

- [Supabase](https://supabase.com/) for providing an open-source backend solution.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework.
- [Vite](https://vitejs.dev/) for fast frontend tooling.
