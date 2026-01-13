/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://isolaboutique.com',
    generateRobotsTxt: true,
    sitemapSize: 7000,
}