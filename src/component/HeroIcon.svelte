<script lang="ts">
    export let hero: HeroData;
    export let locked: boolean = false;

    function mutateDrag(event: DragEvent) {
        event.dataTransfer.setData("id", hero.id.toString(10));
    }
</script>

<div draggable={!(locked === true || hero.masked === true)} class="icon{hero.masked === true ? ' masked' : ''}{locked === true ? ' locked' : ''}" style="--icon: url({hero.circleIcon})" on:dragstart={mutateDrag}>
    <div class="image" />
</div>

<style>
    .icon {
        background: linear-gradient(180deg, #000933 0, #141f52);
        border-radius: 50%;
        box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.6);
        box-sizing: content-box;
        display: inline-block;
        position: relative;
        margin: 4px;
        transition: opacity 0.2s, filter 0.2s;
        cursor: pointer;
        opacity: 0.9;
        filter: grayscale(0%);
    }

    .icon.locked,
    .icon.masked {
        cursor: default;
    }

    .icon,
    .image,
    .image::before {
        height: 75px;
        width: 75px;
    }

    .icon.masked {
        opacity: 0.3;
        filter: grayscale(100%);
    }

    .icon::after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        border: 2px solid rgba(51, 153, 255, 0.4);
        display: block;
        background-image: none;
        box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.8);
        transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
    }

    .icon:hover:not(.masked):not(.locked)::after {
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
        border-radius: 50%;
    }

    .image::before {
        content: "";
        background: var(--icon) no-repeat;
        background-size: contain;
        transition: transform 0.2s;
    }

    .icon:hover:not(.masked):not(.locked) .image::before {
        transform: scale(1.05) perspective(1px);
    }

    @media (prefers-reduced-motion) {
        .icon:hover:not(.masked):not(.locked) .image::before {
            transform: none;
        }
    }

    @media (max-width: 1000px) {
        .icon,
        .image,
        .image::before {
            height: 50px;
            width: 50px;
        }
    }
</style>
