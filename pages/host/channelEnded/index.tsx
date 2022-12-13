function ChannelEnded() {
  const topPageUrl = process.env.NEXT_PUBLIC_FRONT_URL
  return (
    <div>
      TODO: マルチリンガルにすること
      <br />
      Thank you for using our service!
      <a href={topPageUrl} className="text-blue-500">
        トップページへのリンク
      </a>
    </div>
  )
}

export default ChannelEnded
