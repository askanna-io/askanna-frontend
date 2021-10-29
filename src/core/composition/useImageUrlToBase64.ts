export default () => {
  const getBase64 = (e: any, callback: any) => {
    const fileObject = (e?.target && e?.target?.files[0]) || e
    const reader = new FileReader()

    reader.onload = () => callback({ url: URL.createObjectURL(fileObject), result: reader.result })

    reader.readAsDataURL(fileObject)
  }

  const convertUrlToBase64 = async (avatar: string, callback: any, name: 'ask-annna-default-gravatar.png') => {
    const base64Response = await fetch(avatar)

    const blob = await base64Response.blob()
    //@ts-expect-error
    const file = new File([blob], name, { type: 'image/png', lastModified: new Date() })

    getBase64(file, callback)
  }

  return { getBase64, convertUrlToBase64 }
}
