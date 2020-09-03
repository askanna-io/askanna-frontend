const regex = /(<([^>]+)>)/gi

export default () => (html: string) => html && html.replace(regex, ' ')
