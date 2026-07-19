<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">WikiBinge</h3>
  <p align="center">
    A healthier alternative to traditional social media
    <br />
    <br />
    <a href="https://wiki-binge.vercel.app/">View Demo</a>
    &middot;
    <a href="https://github.com">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This project functions as a recommendation algorithm for Wikipedia articles. The recommendation engine is powered by the Gemini AI Embedding API, designed to help users discover higher quality information in their free time instead of endlessly scrolling traditional feeds.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Tailwind][Tailwind]][Tailwind-url]
* [![Supabase][Supabase]][Supabase-url]
* [![shadcn/ui][shadcn]][shadcn-url]
* [![Gemini][Gemini]][Gemini-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up a local development copy of WikiBinge.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Obtain your API credentials for **Supabase**, **IMGBB**, **UploadThing**, and **Gemini**.
2. Clone the repository:
   ```sh
   git clone https://github.com/baarbi3/wiki-binge.git
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Create a `.env.local` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SECRET_KEY=your_secret_key
   UPLOADTHING_TOKEN=your_uploadthing_token
   IMGBB_API_KEY=your_imgbb_api_key
   ```
5. Update your git remote to prevent accidental pushes upstream:
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Implement robust user onboarding flow
- [ ] Add bookmarking features for read-later logs
- [ ] Multi-language Support
    - [ ] Spanish
    - [ ] German

See the [open issues](https://github.com) for a full list of proposed features and known bugs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion to improve this project, please fork the repository and open a pull request. You can also open an issue tagged "enhancement". 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/baarbi3/wiki-binge/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=baarbi3/wiki-binge" alt="contributors profile image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

**Ayan** - [@Barbar0sDev](https://x.com/@Barbar0sDev) - ayan.whiz@gmail.com - [https://barbar0s.vercel.app/]  
Project Link: [https://github.com/baarbi3/wiki-binge](https://github.com/baarbi3/wiki-binge)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)
* [Supabase](https://supabase.com)
* [Tailwind CSS](https://tailwindcss.com)
* [Google Gemini API](https://google.dev)
* [shadcn/ui](https://ui.shadcn.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://shields.io
[contributors-url]: https://github.com/baarbi3/wiki-binge/graphs/contributors
[forks-shield]: https://shields.io
[forks-url]: https://github.com
[stars-shield]: https://shields.io
[stars-url]: https://github.com
[issues-shield]: https://shields.io
[issues-url]: https://github.com

[Next.js]: https://shields.io
[Next-url]: https://nextjs.org
[React.js]: https://shields.io
[React-url]: https://reactjs.org
[TypeScript]: https://shields.io
[TypeScript-url]: https://typescriptlang.org
[Tailwind]: https://shields.io
[Tailwind-url]: https://tailwindcss.com
[Supabase]: https://shields.io
[Supabase-url]: https://supabase.com
[shadcn]: https://shields.io
[shadcn-url]: https://ui.shadcn.com
[Gemini]: https://shields.io
[Gemini-url]: https://google.dev
