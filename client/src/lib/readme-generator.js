export function generateReadmeContent(profile) {
  const sections = [];

  // Header with animated typing effect
  sections.push(`<div align="center">
  <h1>
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=35&pause=1000&color=2E96FF&center=true&vCenter=true&width=435&lines=Hi+👋,+I'm+${encodeURIComponent(profile.name)};${encodeURIComponent(profile.title)}" alt="Typing SVG" />
  </h1>
  
  <!-- Animated GIF -->
  <img src="https://raw.githubusercontent.com/abhisheknaiidu/abhisheknaiidu/master/code.gif" width="400" height="250" alt="Coding GIF"/>
  
  <!-- Profile Views Counter -->
  <img src="https://visitcount.itsvg.in/api?id=${profile.githubUsername}&icon=0&color=0" alt="Profile Views"/>
</div>

---`);

  // About Me Section
  if (profile.bio || profile.currentFocus || profile.email || profile.location) {
    sections.push(`## 💫 About Me

${profile.bio || ''}`);

    const aboutPoints = [];
    if (profile.currentFocus) {
      aboutPoints.push(`🔭 I'm currently working on **${profile.currentFocus}**`);
    }
    if (profile.email) {
      aboutPoints.push(`📫 How to reach me: **${profile.email}**`);
    }
    if (profile.location) {
      aboutPoints.push(`📍 Based in **${profile.location}**`);
    }
    if (profile.website) {
      aboutPoints.push(`🌐 Check out my website: **${profile.website}**`);
    }

    if (aboutPoints.length > 0) {
      sections.push(aboutPoints.join('\n\n'));
    }

    sections.push('---');
  }

  // Social Media Section
  const socialBadges = [];
  
  if (profile.linkedinUrl) {
    socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](${profile.linkedinUrl})`);
  }
  
  if (profile.twitterUrl) {
    socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?logo=Twitter&logoColor=white)](${profile.twitterUrl})`);
  }
  
  if (profile.kaggleUrl) {
    socialBadges.push(`[![Kaggle](https://img.shields.io/badge/Kaggle-%2320BEFF.svg?logo=Kaggle&logoColor=white)](${profile.kaggleUrl})`);
  }

  if (profile.socialLinks) {
    profile.socialLinks.forEach(link => {
      const platformLower = link.platform.toLowerCase();
      socialBadges.push(`[![${link.platform}](https://img.shields.io/badge/${link.platform}-%23FF0000.svg?logo=${platformLower}&logoColor=white)](${link.url})`);
    });
  }

  if (socialBadges.length > 0) {
    sections.push(`## 🌐 Socials
${socialBadges.join(' ')}

---`);
  }

  // Tech Stack Section
  if (profile.technologies && profile.technologies.length > 0) {
    sections.push('## 💻 Tech Stack');

    const categories = {
      language: 'Languages',
      framework: 'Frameworks & Libraries',
      database: 'Databases',
      tool: 'Tools & Platforms',
      cloud: 'Cloud & DevOps',
      other: 'Other Technologies'
    };

    Object.entries(categories).forEach(([key, title]) => {
      const techs = profile.technologies?.filter(t => t.category === key);
      if (techs && techs.length > 0) {
        sections.push(`### ${title}`);
        const badges = techs.map(tech => {
          const skillEmoji = tech.level === 'expert' ? '🔥' : 
                           tech.level === 'advanced' ? '⭐' : 
                           tech.level === 'intermediate' ? '💫' : '🌟';
          return `![${tech.name}](https://img.shields.io/badge/${encodeURIComponent(tech.name)}-${getColorForTech(tech.name)}?style=for-the-badge&logo=${encodeURIComponent(tech.name.toLowerCase())}&logoColor=white) ${skillEmoji}`;
        });
        sections.push(badges.join(' '));
        sections.push('');
      }
    });

    sections.push('---');
  }

  // GitHub Stats Section
  sections.push(`## 📊 GitHub Stats

<div align="center">
  
  ![${profile.githubUsername}'s Stats](https://github-readme-stats.vercel.app/api?username=${profile.githubUsername}&theme=highcontrast&hide_border=false&include_all_commits=false&count_private=false)
  
  ![${profile.githubUsername}'s Streak](https://github-readme-streak-stats.herokuapp.com/?user=${profile.githubUsername}&theme=highcontrast&hide_border=false)
  
  ![${profile.githubUsername}'s Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${profile.githubUsername}&theme=highcontrast&hide_border=false&include_all_commits=false&count_private=false&layout=compact)

</div>

---`);

  // GitHub Trophies
  sections.push(`## 🏆 GitHub Trophies

<div align="center">
  
  ![${profile.githubUsername}'s Trophies](https://github-profile-trophy.vercel.app/?username=${profile.githubUsername}&theme=matrix&no-frame=false&no-bg=true&margin-w=4)

</div>

---`);

  // Top Contributed Repositories
  sections.push(`## 🔝 Top Contributed Repo

<div align="center">
  
  ![${profile.githubUsername}'s Top Repo](https://github-contributor-stats.vercel.app/api?username=${profile.githubUsername}&limit=5&theme=algolia&combine_all_yearly_contributions=true)

</div>

---`);

  // Custom Sections
  if (profile.customSections && profile.customSections.length > 0) {
    profile.customSections
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        sections.push(`## ${section.title}`);
        sections.push(section.content);
        sections.push('---');
      });
  }

  // Activity Graph
  sections.push(`## 📈 Activity Graph

<div align="center">
  
  [![${profile.githubUsername}'s github activity graph](https://github-readme-activity-graph.vercel.app/graph?username=${profile.githubUsername}&theme=react-dark)](https://github.com/ashutosh00710/github-readme-activity-graph)

</div>

---`);

  // Footer
  sections.push(`<div align="center">
  
  ### ✨ Generated with GitHub Profile README Generator
  
  ![Snake animation](https://github.com/${profile.githubUsername}/${profile.githubUsername}/blob/output/github-contribution-grid-snake.svg)
  
  ---
  
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Random Dev Quote"/>
  
</div>`);

  return sections.join('\n\n');
}

function getColorForTech(techName) {
  const colors = {
    'javascript': 'F7DF1E',
    'typescript': '3178C6',
    'python': '3776AB',
    'java': 'ED8B00',
    'kotlin': '0095D5',
    'swift': 'FA7343',
    'react': '61DAFB',
    'vue': '4FC08D',
    'angular': 'DD0031',
    'nodejs': '339933',
    'express': '000000',
    'mongodb': '47A248',
    'postgresql': '336791',
    'mysql': '4479A1',
    'redis': 'DC382D',
    'docker': '2496ED',
    'kubernetes': '326CE5',
    'aws': '232F3E',
    'gcp': '4285F4',
    'azure': '0078D4',
    'firebase': 'FFCA28',
    'git': 'F05032',
    'github': '181717',
    'vscode': '007ACC',
    'figma': 'F24E1E',
    'html5': 'E34F26',
    'css3': '1572B6',
    'sass': 'CC6699',
    'tailwindcss': '06B6D4',
    'bootstrap': '7952B3',
    'android': '3DDC84',
    'ios': '000000',
    'flutter': '02569B',
    'dart': '0175C2',
    'go': '00ADD8',
    'rust': '000000',
    'c': 'A8B9CC',
    'cpp': '00599C',
    'csharp': '239120',
    'php': '777BB4',
    'ruby': 'CC342D',
    'linux': 'FCC624',
    'ubuntu': 'E95420',
    'windows': '0078D6',
    'macos': '000000'
  };

  return colors[techName.toLowerCase()] || '000000';
}