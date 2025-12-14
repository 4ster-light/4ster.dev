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
      <meta property="og:image" content={urls.bannerUrl} />
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
      <meta name="twitter:image" content={urls.bannerUrl} />
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
        <div>
          <h2 class="text-4xl font-bold text-secondary mb-4">Support Me</h2>
          <p>
            If you like my work you can <strong>subscribe</strong> or <strong>donate</strong> to my
            {" "}
            <a href={urls.kofiUrl} target="_blank" rel="noopener">
              Ko-fi page
            </a>
            , where I also post updates and different content by the way.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Cryptocurrency Donations</h3>
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
        </div>
      </div>
    </div>
  )
})
