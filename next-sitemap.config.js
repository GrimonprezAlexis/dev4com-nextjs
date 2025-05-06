/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://dev4com.com',
    generateRobotsTxt: false, // We already have a custom robots.txt
    changefreq: 'weekly',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin/*'],
    generateIndexSitemap: false,
    alternateRefs: [
      {
        href: 'https://dev4com.com',
        hreflang: 'fr',
      },
    ],
    transform: async (config, path) => {
      // Custom transformation for specific pages
      const priorities = {
        '/': 1.0,
        '/services': 0.9,
        '/projects': 0.8,
        '/contact': 0.7,
      };
  
      const frequencies = {
        '/': 'daily',
        '/services': 'weekly',
        '/projects': 'weekly',
        '/contact': 'monthly',
      };
  
      return {
        loc: path,
        changefreq: frequencies[path] || config.changefreq,
        priority: priorities[path] || config.priority,
        lastmod: new Date().toISOString(),
        alternateRefs: config.alternateRefs || [],
      };
    },
  };