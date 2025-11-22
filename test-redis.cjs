const Redis = require('ioredis');

async function testConnection(url) {
    console.log(`Testing: ${url.replace(/:[^:@]+@/, ':***@')}`);
    const redis = new Redis(url, {
        retryStrategy: () => null, // Don't retry
        maxRetriesPerRequest: 1,
    });

    try {
        await redis.info();
        console.log('SUCCESS!');
        redis.disconnect();
        return true;
    } catch (err) {
        console.log('FAILED:', err.message);
        redis.disconnect();
        return false;
    }
}

async function main() {
    const host = 'redis-14360.c301.ap-south-1-1.ec2.cloud.redislabs.com';
    const port = 14360;
    const pass = 'WD1xtCGH8kZkYtoD*';

    // 1. Standard
    await testConnection(`redis://:${pass}@${host}:${port}`);

    // 2. With default username
    await testConnection(`redis://default:${pass}@${host}:${port}`);

    // 3. TLS
    await testConnection(`rediss://:${pass}@${host}:${port}`);

    // 4. TLS with default username
    await testConnection(`rediss://default:${pass}@${host}:${port}`);
}

main();
