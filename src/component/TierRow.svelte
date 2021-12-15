<script lang="ts">
    import HeroCard from "./HeroCard.svelte";
    import HeroIcon from "./HeroIcon.svelte";
    import { createEventDispatcher } from "svelte";

    export let tier: Tier;
    export let locked: boolean;
    export let mobile: boolean;
    export let icon: boolean;
    export let heroData: HeroData[];

    $: {
        heroData = heroData.filter((hero) => {
            if (hero.tier == tier.id) {
                return true;
            }

            if (hero.tier === tier.altTier) {
                return true;
            }

            return false;
        });
        heroData.sort((a: HeroData, b: HeroData) => {
            const name1 = a.name.toUpperCase();
            const name2 = b.name.toUpperCase();
            if (name1 < name2) {
                return -1;
            }
            if (name1 > name2) {
                return 1;
            }
            return 0;
        });
        heroData.sort((a: HeroData, b: HeroData) => {
            if (a.role < b.role) {
                return -1;
            }
            if (a.role > b.role) {
                return 1;
            }
            return 0;
        });
        heroData = heroData;
    }

    const dispatch = createEventDispatcher<{ moveHero: MoveHeroEvent }>();

    function doDrop(event: DragEvent) {
        event.preventDefault();
        const data = event.dataTransfer.getData("id");
        const heroId = Number.parseInt(data, 10);
        dispatch("moveHero", {
            heroId: heroId,
            tierListId: tier.id,
        });
    }

    function allowDrop(event: DragEvent) {
        event.preventDefault();
    }
</script>

<div class="tier" style="--color: {tier.color}">
    <div class="name">{tier.label}</div>
    <div class="list" on:drop={doDrop} on:dragover={allowDrop}>
        {#each heroData as hero (hero.id)}
            {#if icon}
                <HeroIcon {hero} locked={mobile || locked} />
            {:else}
                <HeroCard {hero} locked={mobile || locked} />
            {/if}
        {/each}
    </div>
</div>

<style>
    .tier {
        min-height: 83px;
        display: flex;
        flex-direction: row;
        font-size: 25px;
        align-items: stretch;
    }

    .tier .name {
        display: block;
        min-width: 150px;
        max-width: 150px;
        line-height: 83px;
        padding: 0 15px;
        text-align: right;
        background: var(--color);
        opacity: 0.9;
        box-shadow: -7px 0 13px rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(51, 153, 255, 0.4);
    }

    .tier .list {
        box-shadow: 7 0 13px rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(51, 153, 255, 0.4);
        width: 100%;
    }

    @media (max-width: 1000px) {
        .tier {
            min-height: 70px;
            display: flex;
            flex-direction: row;
            font-size: 14px;
            align-items: stretch;
        }

        .tier .name {
            min-width: 75px;
            max-width: 75px;
            line-height: 70px;
            padding: 0 5px;
        }
    }
</style>
