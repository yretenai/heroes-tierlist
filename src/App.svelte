<script lang="ts">
	import TierRow from "./component/TierRow.svelte";
	import { onMount } from "svelte";

	export let heroData: HeroData[];

	let icon: boolean = true;
	let locked: boolean = false;

	let mobile: boolean = false;
	const ua = navigator.userAgent.toLowerCase();
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substring(0, 4))) {
		mobile = true;
	}

	let search: string = "";

	let roleFilter: number = -1;

	let tiers: Tier[] = [
		{ label: "SSS", color: "purple", id: 6, altTier: undefined },
		{ label: "S", color: "purple", id: 5, altTier: undefined },
		{ label: "A", color: "purple", id: 4, altTier: undefined },
		{ label: "B", color: "purple", id: 3, altTier: 6 },
		{ label: "C", color: "purple", id: 2, altTier: undefined },
		{ label: "D", color: "purple", id: 1, altTier: undefined },
		{ label: "F", color: "purple", id: 0, altTier: undefined },
		{ label: "Unsorted", color: "purple", id: -1, altTier: undefined },
	];

	$: filteredHeroData = heroData.map((hero) => {
		hero.masked = search.length > 0 && `${hero.name} ${hero.search}`.toUpperCase().indexOf(search.toUpperCase()) == -1;
		if (!hero.masked && roleFilter > -1) {
			hero.masked = hero.role != roleFilter;
		}
		if (hero.tier === undefined || hero.tier >= tiers.length || hero.tier < -1) {
			hero.tier = -1;
		}
		return hero;
	});

	function encodeTiers() {
		if (!heroData.some((hero) => hero.tier > -1)) {
			location.hash = "";
			return;
		}

		let buckets: Array<Array<number>> = [];
		for (let i = 0; i < tiers.length - 1; ++i) {
			buckets.push([]);
		}

		for (let hero of heroData) {
			if (hero.tier > -1) {
				buckets[hero.tier].push(hero.id);
			}
		}

		// WARN: If hero id ever goes over 255, this breaks. Right now it's at 90. I strongly doubt it'll ever go over that.
		// version Byte + bucket counts + entries + isLocked
		let array = new Uint8Array(1 + buckets.length + buckets.reduce((current, bucket) => current + bucket.length, 0) + 1);
		let byteIndex = 0;
		array[byteIndex++] = 2;
		for (let i = 0; i < buckets.length; ++i) {
			array[byteIndex++] = buckets[i].length;

			for (let heroId of buckets[i]) {
				array[byteIndex++] = heroId;
			}
		}
		array[byteIndex++] = locked ? 1 : 0;

		location.hash = `#${btoa(String.fromCharCode.apply(null, array))}`;
	}

	onMount(() => {
		if (location.hash.length < 2) {
			return;
		}

		const array = new Uint8Array(
			atob(location.hash.substring(1))
				.split("")
				.map(function (c) {
					return c.charCodeAt(0);
				})
		);
		let byteIndex = 0;

		let version = array[byteIndex++];

		let heroIdToTier = {};
		if (version >= 1) {
			for (let i = 0; i < tiers.length - 1; ++i) {
				const count = array[byteIndex++];

				for (let j = 0; j < count; ++j) {
					heroIdToTier[array[byteIndex++]] = i;
				}
			}
		}

		if (version >= 2) {
			locked = array[byteIndex++] == 1;
		}

		heroData = heroData.map((hero) => {
			if (hero.id in heroIdToTier) {
				hero.tier = heroIdToTier[hero.id];
			}
			return hero;
		});
	});

	function moveHero(event: CustomEvent<MoveHeroEvent>) {
		heroData = heroData.map((hero) => {
			if (hero.id == event.detail.heroId) {
				hero.tier = event.detail.tierListId;
			}
			return hero;
		});

		encodeTiers();
	}

	function hasTier(tier: Tier) {
		if (tier.id == -1 && locked) {
			return false;
		}
		return heroData.some((hero) => hero.tier == tier.id || hero.tier == tier.altTier);
	}
</script>

<main>
	<nav>
		<div class="block name">
			<h1>Heroes of the Storm Tier List</h1>
			<h3>
				Not affiliated, endorsed or authorized by Blizzard Entertainment, inc.<br />
				Heroes of the Storm is &copy;2021 Blizzard Entertainment, inc. ALL RIGHTS RESERVED.
			</h3>
		</div>
		<div class="block filters">
			<div class="search">
				<input type="text" placeholder="Search" bind:value={search} />
			</div>
			<div class="roles">
				<div class="role{roleFilter == -1 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="-1" />
						<svg viewBox="-10 -15 240 240" width="40" height="40"><rect x="143.6" y="143.6" width="49.77" height="49.77" /><rect x="83.12" y="143.6" width="49.77" height="49.77" /><rect x="22.64" y="143.6" width="49.77" height="49.77" /><rect x="143.6" y="83.12" width="49.77" height="49.77" /><rect x="83.12" y="83.12" width="49.77" height="49.77" /><rect x="22.64" y="83.12" width="49.77" height="49.77" /><rect x="143.6" y="22.64" width="49.77" height="49.77" /><rect x="83.12" y="22.64" width="49.77" height="49.77" /><rect x="22.64" y="22.64" width="49.77" height="49.77" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 0 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="0" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M108,202.08S37,163,40.42,68.7l9.78-7V30.46a69.52,69.52,0,0,0,30.28,0C96.9,26.73,108,14.13,108,14.13s11,12.6,27.43,16.33a69.26,69.26,0,0,0,30.22,0V61.7l9.76,7C178.83,163,108,202.08,108,202.08ZM166.07,74.76l-8.83-7v-27a82.1,82.1,0,0,1-24.64-1.87C119.47,35.76,108,26.26,108,26.26s-11.53,9.5-24.69,12.59a82.36,82.36,0,0,1-24.68,1.87v27l-8.85,7S47,149.43,108,190C168.85,149.43,166.07,74.76,166.07,74.76Zm-33,24.72c0-6.88,3.26-9.33,3.26-9.33l16.24-16.29,5.61,4.63c.34,33.27-12.38,59-25.11,76.43Zm2.33-12.59a16.81,16.81,0,0,0-5.12,12.59v59.13C118.72,173.37,108,181.09,108,181.09s-10.78-7.72-22.36-22.48V99.48a16.81,16.81,0,0,0-5.12-12.59C76.23,83,68.93,75.49,65.54,72l0,0V47.71S89.18,50.29,108,34.65c18.75,15.64,42.31,13.06,42.31,13.06V72l0,0C146.92,75.49,139.63,83,135.39,86.89ZM82.81,99.48v55.44c-12.75-17.39-25.5-43.16-25.16-76.43l5.62-4.63L79.55,90.15S82.81,92.6,82.81,99.48Z" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 1 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="1" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M163.12,143.75l-4.92-13.33s-10.43-4.12-20.66-6.91c0,0,3.34-7.05,5.41-12.34,0,0,11.14,2.75,13.78,4A109.66,109.66,0,0,0,159.19,87S140.56,70.7,103,70.7,47.53,87,47.53,87s.37,13.26,2,21.22l3-1a176.92,176.92,0,0,0,2.83,17.56L49,127.08,43.6,143.26s-16.4-40-9.35-112c0,0,7.87,19.81,20.17,32.08,0,0,6.78-4.18,23.12-6.91L103.11,5.06l25.58,51.33a113.66,113.66,0,0,1,24.1,6.91,127.06,127.06,0,0,0,19.68-32.08S179.65,92.24,163.12,143.75Zm-96-43.19-.48-9s5.84-5.36,9.5-5.7,9,2.38,9,2.38a129.5,129.5,0,0,1,0,14.25L74.28,99.61Zm72.19-10.45c2.92.27,7.57,7.11,8.08,20l-6.65-2.38s-4,14.87-8.55,15.68-10.93-1.42-10.93-1.42a169.81,169.81,0,0,0,10.45-29S136.43,89.83,139.35,90.11Zm-18.52-4.76c2.73.43,7.6,5.71,7.6,5.71s-5.65,20.5-9,26.6c-2.79,5-12.05,1.41-14.25.48,0,0,4.44-18.24,6.18-29.93C111.33,88.21,117.57,84.85,120.83,85.35ZM98.5,83.45c3.53-.06,8.55,3.81,8.55,3.81a103.28,103.28,0,0,1-2.85,17.57S95,105,89,103.41c0,0,.36-8,0-14.73C89,88.68,95,83.52,98.5,83.45ZM72.62,103.77c3.53.23,13.42,3.32,20.66,4a82.53,82.53,0,0,0,9.76.49s.64,6.6-5.34,13.33c0,0-6.19,3.82-15.74,3s-15.24-8.88-15.24-8.88S71.83,126.34,77,127.46s17.36-.56,21.15.5,8.81,4.31,22.14,20.73c0,0-5-8.86-10-15.83a61.54,61.54,0,0,0-7.13-8.07,211.84,211.84,0,0,1,21.38,2.37c9.86,1.68,19.66,4.58,20.9,5.23,0,0-1.9,16.15-3.33,19s-8.1,9.14-8.1,9.14v9.87A179.28,179.28,0,0,1,108,185.7a167.69,167.69,0,0,1-26.56-15.3V162l-10.33-5.92s-1.7-.37-3.44-4S58,133.86,55.89,106.24C55.89,106.24,69.08,103.54,72.62,103.77Zm7.84,78a27.64,27.64,0,0,0,1-8.45C93,181.49,108,188.15,108,188.15c10.41-4.7,26.07-14.8,26.07-14.8a29.86,29.86,0,0,0,1.45,8,19.18,19.18,0,0,0,3.8,6.17C129.22,195.94,108,208.41,108,208.41c-13.51-7.23-31.37-20.91-31.37-20.91A13.46,13.46,0,0,0,80.46,181.8Z" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 2 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="2" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M203.13,27.23,184.78,65.86s.25,32.68-16.43,54l3.88,22.81L151.54,135a109.08,109.08,0,0,1-31,13.92V132.48s21.71-2.58,37.18-24.62,11.59-47.32,11.59-47.32ZM123,53.37,136,40.25V58L123,71.07v5l8.27-8.29V83L113.8,100.63v69.05c14.89,0,20.21-5.79,20.21-5.79L108,209.2v0l0,0v-.05L81.92,163.87s5.34,5.79,20.29,5.79V100.58L84.73,83V67.69L93,76V71L79.9,57.88V40.17L93,53.3V48.47l-18-18.11V12.65L108,45.58v.23l0-.16,32.81-32.91v17.7L123,48.55ZM95.44,148.9a109.08,109.08,0,0,1-31-13.92l-20.69,7.64,3.88-22.81C31,98.54,31.22,65.86,31.22,65.86L12.87,27.23l33.8,33.31s-3.88,25.28,11.59,47.32,37.18,24.62,37.18,24.62Z" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 3 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="3" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M111,202.5c15-10,29.22-31.43,32-41-9,0-14-13-14-22v-47l-18,16Z" /><path d="M105,202.5c-15-10-29.22-31.43-32-41,9,0,14-13,14-22v-47l18,16Z" /><path d="M150.28,37.44C150.28,55.28,135,67.5,126.5,73c-4.82,3.09-11.23,5.45-11.23-1.82V40.5c0-9.74,7.26-9,7.26-9,0-9.74-14.53-18-14.53-18s-14.53,8.26-14.53,18c0,0,7.26-.74,7.26,9V71.13c0,7.27-6.41,4.91-11.23,1.82C81,67.5,65.72,55.28,65.72,37.44,53.83,59.24,82.4,81.7,108,103.5,133.6,81.7,162.17,59.24,150.28,37.44Z" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 4 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="4" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M171.77,132.69H132.69v39.08c0,3.41-4.82,8.23-8.23,8.23H91.54c-3.41,0-8.23-4.82-8.23-8.23V132.69H44.23c-3.41,0-8.23-4.82-8.23-8.23V91.54c0-3.41,4.82-8.23,8.23-8.23H83.31V44.23c0-3.41,4.82-8.23,8.23-8.23h32.92c3.41,0,8.23,4.82,8.23,8.23V83.31h39.08c3.41,0,8.23,4.82,8.23,8.23v32.92C180,127.87,175.18,132.69,171.77,132.69Z" /></svg>
					</label>
				</div>
				<div class="role{roleFilter == 5 ? ' active' : ''}">
					<label class="icon">
						<input type="radio" bind:group={roleFilter} value="5" />
						<svg viewBox="0 0 210 210" width="40" height="40"><path d="M204.4,106.09,177.2,128A76.41,76.41,0,0,0,181,106.09c0-11.16-3.81-22.41-3.81-22.41Zm-52,0A44.38,44.38,0,1,1,108,61.73,44.37,44.37,0,0,1,152.38,106.09ZM125.66,170.5v6.66c0,7.63,6.2,9.06,6.2,9.06a81.83,81.83,0,0,1-10,9.54A118.65,118.65,0,0,1,108,204.83h0a118.65,118.65,0,0,1-13.84-9.07,81.83,81.83,0,0,1-10-9.54s6.2-1.43,6.2-9.06V170.5a66.79,66.79,0,0,1-.47-128.69V31.69s-.11-6.76-6.21-7.63l20.52-12.4v44a50.59,50.59,0,1,0,7.64,0v-44l20.52,12.4c-6.1.87-6.21,7.63-6.21,7.63V41.81a66.79,66.79,0,0,1-.47,128.69ZM11.6,106.09,38.8,83.68S35,94.93,35,106.09A76.41,76.41,0,0,0,38.8,128Z" /></svg>
					</label>
				</div>
			</div>
		</div>
		<div class="block toggles" style={mobile ? "display: none" : ""}>
			<label>
				<input type="checkbox" bind:checked={icon} />
				Use Icons
			</label>
			<label>
				<input type="checkbox" bind:checked={locked} on:change={encodeTiers} />
				Lock
			</label>
		</div>
	</nav>
	<div class="tierlist">
		{#each tiers as tier (tier.id)}
			{#if !locked || hasTier(tier)}
				<TierRow {tier} bind:locked {mobile} bind:icon bind:heroData={filteredHeroData} on:moveHero={moveHero} />
			{/if}
		{/each}
	</div>
</main>

<style>
	main {
		margin: 0 auto;
		position: relative;
		background: #0e001a;
		border-left: 1px solid #143d66;
		border-right: 1px solid #143d66;
		background: url(./img/bg.jpg) top center no-repeat #000d1a;
		max-width: 2400px;
		min-height: 100%;
	}

	nav,
	.tierlist {
		padding: 0 50px;
	}

	nav {
		display: flex;
		justify-content: left;
		align-items: center;
		align-content: stretch;
		gap: 10px;
		height: 150px;
		background: url(./img/bggradient.png) repeat-x;
	}

	nav h1 {
		font-size: 32px;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
		margin: auto;
		padding: 0;
		padding-top: 30px;
		margin: 0;
	}

	nav h3 {
		text-transform: uppercase;
		font-size: 10px;
		padding: 0;
		padding-bottom: 30px;
		margin: 0;
		opacity: 0.9;
	}

	nav .search {
		display: inline-block;
		text-align: center;
		width: 100%;
		margin-bottom: 5px;
	}

	nav input {
		margin: 0;
	}

	nav .search input {
		color: #fff;
		position: relative;
		display: inline-block;
		min-width: 100%;
		font-size: 16px;
		font-weight: 700;
		border: 1px solid #39f;
		background-color: rgba(0, 26, 51, 1);
		box-shadow: 0 0 13px rgba(0, 0, 0, 0.4);
		padding: 0.6254em 1.2508em;
		border: 2px solid rgba(51, 153, 255, 0.4);
		box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.8);
		transition: border-color 0.2s, box-shadow 0.2s;
		outline: none;
	}

	nav .search input:active,
	nav .search input:hover {
		box-shadow: inset 0 0 10px 2px rgba(0, 128, 255, 0.5);
		border-color: rgba(51, 128, 204, 0.8);
	}

	.roles {
		display: flex;
		align-content: center;
	}

	.role {
		flex: 1;
	}

	.role input {
		display: none;
	}

	.role svg {
		fill: #9c9c9c;
	}

	.role.active svg,
	.role:hover svg {
		fill: white;
	}

	.tierlist {
		padding-bottom: 30px;
	}

	@media (max-width: 1000px) {
		nav,
		.tierlist {
			padding: 0 5px;
		}

		nav {
			display: block;
			height: auto;
		}

		nav h1 {
			font-size: 28px;
			text-align: center;
		}

		nav h3 {
			text-align: center;
			padding-bottom: 10px;
		}

		nav .block {
			display: block;
		}

		nav .filters,
		nav .toggles {
			margin-bottom: 5px;
		}

		nav .filters .roles {
			text-align: center;
		}

		nav .toggles {
			text-align: center;
		}

		nav .toggles label {
			display: inline-block;
			margin: 0 5px;
		}
	}
</style>
