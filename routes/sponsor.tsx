import { Head } from "fresh/runtime"
import { define } from "@/utils.ts"
import urls from "@/lib/urls.ts"
import CopyAddressButton from "@/islands/CopyAddressButton.tsx"

function SEO() {
  return (
    <Head>
      <title>Support - ✰λster✰</title>
      <meta
        name="description"
        content="Support my work by donating or subscribing on Ko-fi, or sending cryptocurrency to my wallet addresses."
      />
      <meta name="author" content="David Vivar Bogónez" />

      <meta property="og:title" content="Support - ✰λster✰" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={urls.banner} />
      <meta
        property="og:description"
        content="Support my work by donating or subscribing on Ko-fi, or sending cryptocurrency to my wallet addresses."
      />
      <meta property="og:url" content={`${urls.url}/donate`} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:title" content="Support - ✰λster✰" />
      <meta
        name="twitter:description"
        content="Support my work by donating or subscribing on Ko-fi, or sending cryptocurrency to my wallet addresses."
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.banner} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

const cryptoAddresses = {
  BTC: "3LdNwreu7xAoK5hjGRiPae8fE3mtRcbBg4",
  ETH: "0x08c799ed97218bb9eF09c14a6CED89a02bc8D6Ae",
  SOL: "HWTCff3cpc7MguF5DMEybFt1NF9Vu15oteYXWMeNBe8v",
  SUI: "0xcbb0bb734638770cac5b28d69caa6899bcf54cc6eba37347746b4b6f33e4dffe"
} as const

export default define.page(function Donate() {
  return (
    <div>
      <SEO />

      <div class="space-y-8">
        <h2 class="text-4xl font-bold text-secondary mb-8">Support Me</h2>
        <section>
          <h3 class="text-xl font-semibold mb-4">Github Sponsors</h3>
          <div class="flex justify-center overflow-x-auto">
            <iframe
              src="https://github.com/sponsors/4ster-light/card"
              title="Sponsor 4ster-light"
              class="h-62.5 md:h-31.25 w-full border border-primary rounded-lg"
              frameborder="0"
              scrolling="no"
            />
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-4">Subscribe to My Substack</h3>
          <div class="flex justify-center overflow-x-auto">
            <iframe
              src="https://4sterlight.substack.com/embed"
              height="320"
              class="w-full border border-primary rounded-lg"
              frameborder="0"
              scrolling="no"
            />
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-4">Cryptocurrency Donations</h3>
          <p class="mb-6">
            You can also send cryptocurrency to any of the following wallet addresses if preferred:
          </p>
          <ul class="space-y-4">
            {Object.entries(cryptoAddresses).map(([coin, address]) => (
              <li key={coin} class="flex items-center gap-3 font-mono text-sm">
                <strong class="w-10">{coin}:</strong>
                <code
                  class="text-xs bg-base-200 px-2 py-1 rounded border border-base-300 flex-1 truncate"
                  title={address}
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </code>
                <CopyAddressButton coin={coin} address={address} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
})
