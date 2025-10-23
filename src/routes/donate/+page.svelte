<script lang="ts">
  import { KOFI_URL } from "$lib/urls"

  const cryptoAddresses = {
    BTC: "3LdNwreu7xAoK5hjGRiPae8fE3mtRcbBg4",
    ETH: "0x08c799ed97218bb9eF09c14a6CED89a02bc8D6Ae",
    SOL: "HWTCff3cpc7MguF5DMEybFt1NF9Vu15oteYXWMeNBe8v",
    SUI: "0xcbb0bb734638770cac5b28d69caa6899bcf54cc6eba37347746b4b6f33e4dffe"
  } as const

  let copiedCoin = $state<string | null>(null)

  async function copy(coin: string, address: string) {
    await navigator.clipboard
      .writeText(address)
      .then(() => (copiedCoin = coin))
      .catch(() => console.error(`Failed to copy ${coin} address.`))
      .finally(() => setTimeout(() => (copiedCoin = null), 1000))
  }
</script>

<h2>Support Me</h2>
<div>
  <section class="kofi">
    <p>
      If you like my work you can <strong>subscribe</strong> or <strong>donate</strong> to my <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener"
      >Ko-fi page</a>, where I also post updates and different content by the way.
    </p>
  </section>
  <section class="crypto">
    <p>You can also send cryptocurrency to any of the following wallet addresses if preferred:</p>
    <ul>
      {#each Object.entries(cryptoAddresses) as [coin, address]}
        <li>
          <strong>{coin}:</strong>
          <code title={address}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </code>
          <button onclick={() => copy(coin, address)}>
            {copiedCoin === coin ? "Copied!" : "Copy Address"}
          </button>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style lang="scss">
  @use "$lib/styles/fonts";

  h2 {
    color: var(--accent-bright);
  }

  div {
    .crypto {
      ul {
        li {
          button {
            font-family: fonts.$font-mono;
            margin-left: 0.5rem;
            background: none;
            border: 1px solid var(--accent);
            border-radius: 0.25rem;
            padding: 0.15rem 0.5rem;
            cursor: pointer;
            color: var(--accent);
            font-size: 0.8rem;
            transition: background 0.2s, color 0.2s;

            &:hover {
              background: var(--accent);
              color: white;
            }

            &:active {
              transform: scale(0.97);
            }
          }
        }
      }
    }
  }
</style>
