import { Preview } from '@creatomate/preview';

const containerElement = document.getElementById('container');
const preview = new Preview(containerElement, 'player', 'public-1jwfuxy434xre8m2q9nrt3iy');

preview.onReady = async () => {
    await preview.loadTemplate('7d6ddc58-b433-40db-a2c5-da78f66092e1');
};