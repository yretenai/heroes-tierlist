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
    <div class="name">
        <div class="stick">{tier.label}</div>
    </div>
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
        line-height: 102px;
        padding: 0 15px;
        text-align: right;
        opacity: 0.9;
        border-top: 5px solid var(--color);
        border-right: 5px solid var(--color);
        background: var(--color);
    }

    .tier .name .stick {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
    }

    .tier .list {
        padding: 7px;
        width: 100%;
        border-top: 5px solid var(--color);
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
            font-size: 24px;
            text-align: center;
        }
    }
</style>
