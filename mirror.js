const scrape = require('website-scraper');

const cliArgs = process.argv.slice(2);
if (!cliArgs.length) {
    console.error('Please specify the hostname as the first argument to this script.');
    process.exit(1);
}

const hostname = cliArgs[0]; // Expect the first thing to be a hostname.

const urlsInclude = [
    hostname,
    'gravatar.com' // Gravatar URLs.
];

const urlsExclude = [
    'replytocom=', // Comment permalinks.
    '/go/', // Link cloaker.
    'banggood.com',
    'aliexpress.com',
    'makerfeed.kaspars.net',
];

class MyPlugin {
	apply(addAction) {
		addAction('generateFilename', ({filename}) => {
            if (filename.startsWith(hostname)) {
                filename = filename.replace(hostname, '.'); // Keep the hostname resources in the root directory.
            } else {
                filename = `__${filename}`; // Prefix remote hostnames to isolate.
            }

			return {filename};
		});
	}
}

const options = {
    urls: [
        `https://${hostname}`,
    ],
    recursive: true,
    prettifyUrls: true,
    filenameGenerator: 'bySiteStructure',
    directory: `docs/${hostname}`,
    urlFilter: (url) => {
        return urlsInclude.some(pattern => url.includes(pattern)) && ! urlsExclude.some(pattern => url.includes(pattern));
    },
    plugins: [
        new MyPlugin(),
    ],
};

scrape(options);