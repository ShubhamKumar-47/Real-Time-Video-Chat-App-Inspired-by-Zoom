const IS_PROD = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const server = IS_PROD ?
    "https://api.easymeet.space" :
    "http://localhost:8001";

export default server;