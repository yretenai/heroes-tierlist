<script lang="ts">
    export let hero: HeroData;
    export let locked: boolean = false;
</script>

<div draggable={!(locked === true || hero.masked === true)} class="card{hero.masked === true ? ' masked' : ''}{locked === true ? ' locked' : ''}" style="--icon: url({hero.circleIcon})" data-id={hero.id}>
    <div class="backdrop">
        <img src={hero.cardPortrait} alt={hero.name} />
    </div>
    <div class="text">
        <h1>{hero.name}</h1>
        <h3>{hero.title}</h3>
    </div>
</div>
