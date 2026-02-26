import { useSignal } from "@preact/signals"

interface Props {
  coin: string
  address: string
}

export default function CopyAddressButton({ coin, address }: Props) {
  const copied = useSignal(false)

  function handleCopy() {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 1000)
      })
      .catch((error) => {
        console.error(`Failed to copy ${coin} address: ${error}`)
      })
  }

  return (
    <button type="button" onClick={handleCopy} class="btn btn-sm btn-outline btn-primary">
      {copied.value ? "✓" : "Copy"}
    </button>
  )
}
