import App from './App.svelte';
import HeroData from "./heroData.json";

const app = new App({
    target: document.body,
    props: {
        heroData: HeroData
    }
});

export default app;
