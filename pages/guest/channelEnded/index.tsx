function ChannelEnded() {
  const topPageUrl = process.env.NEXT_PUBLIC_FRONT_URL
  const message = 'ホストにより終了しました' // TODO: 状況によりメッセージを変える
  return (
    <div>
      TODO: マルチリンガルにすること
      <br />
      Thank you for using our service!
      <a href={topPageUrl} className="text-blue-500">
        トップページへのリンク
      </a>
      <p>{message}</p>
    </div>
  )
}

export default ChannelEnded
