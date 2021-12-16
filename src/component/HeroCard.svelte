<script lang="ts">
    export let hero: HeroData;
    export let locked: boolean = false;

    function mutateDrag(event: DragEvent) {
        event.dataTransfer.setData("id", hero.id.toString(10));
    }
</script>

<div draggable={!(locked === true || hero.masked === true)} class="card{hero.masked === true ? ' masked' : ''}{locked === true ? ' locked' : ''}{hero.cardFlip ? ' flip' : ''}" style="--bg: url({hero.cardPortrait}); --offsetX: {hero.cardOffset.x}px; --offsetY: {hero.cardOffset.y}px;" on:dragstart={mutateDrag}>
    <div class="image" />
    <div class="text">
        <h1>{hero.name}</h1>
        <h3>{hero.title}</h3>
    </div>
</div>

<style>
    .card {
        overflow: hidden;
        position: relative;
        box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.6);
        box-sizing: content-box;
        display: inline-block;
        margin: 4px;
        transition: opacity 0.2s, filter 0.2s;
        cursor: pointer;
        opacity: 0.9;
        filter: grayscale(0%);
        background: linear-gradient(180deg, #000933 0, #141f52);
    }

    .card.locked,
    .card.masked {
        cursor: default;
    }

    .card,
    .image,
    .image::before {
        width: 400px;
        height: 150px;
    }

    .card.flip .image {
        transform: scaleX(-1);
    }

    .card.masked {
        opacity: 0.3;
        filter: grayscale(100%);
    }

    .card::after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid rgba(51, 153, 255, 0.4);
        display: block;
        background-image: none;
        box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.8);
        transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
    }

    .card:hover:not(.masked):not(.locked)::after {
        background-color: rgba(0, 128, 255, 0.1);
        background-image: linear-gradient(0deg, rgba(71, 153, 235, 0.6) 0, rgba(71, 153, 235, 0) 40%);
        box-shadow: inset 0 0 10px 2px rgba(0, 128, 255, 0.5);
        border-color: rgba(51, 128, 204, 0.8);
    }

    .image {
        overflow: hidden;
        opacity: 0.9;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        position: relative;
        opacity: 0.7;
    }

    .image::before {
        content: "";
        transition: transform 0.2s;
        background: var(--bg) no-repeat;
        background-size: cover;
        background-position-x: var(--offsetX);
        background-position-y: var(--offsetY);
    }

    .card:hover:not(.masked):not(.locked) .image::before {
        transform: scale(1.05) perspective(1px);
    }

    .card .text {
        position: absolute;
        bottom: 12px;
        left: 12px;
    }

    .card h1,
    .card h3 {
        margin: 0;
        padding: 0;
        font-weight: lighter;
    }

    .card h1 {
        font-size: 1.5em;
    }

    .card h3 {
        font-size: 1.1em;
        font-style: italic;
    }

    @media (prefers-reduced-motion) {
        .card:hover:not(.masked):not(.locked) .image::before {
            transform: none;
        }
    }

    @media (max-width: 1000px) {
        .card,
        .image,
        .image::before {
            width: 100%;
        }
    }
</style>
