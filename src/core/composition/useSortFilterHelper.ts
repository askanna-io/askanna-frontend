import { orderBy } from 'lodash'

const helper = {
  results: [],
  filterByVisibility: function (visibility) {
    this.results = visibility ? this.results.filter(item => item.visibility === visibility.toUpperCase()) : this.results
    return this
  },
  filterByMember: function (is_member) {
    this.results =
      typeof is_member !== 'undefined' && is_member !== ''
        ? this.results.filter(item => String(item.is_member) === String(is_member))
        : this.results
    return this
  },
  filterBySearchtext: function (searchtext) {
    this.results = searchtext
      ? this.results.filter(item => item.name.toLowerCase().includes(searchtext.toLowerCase()))
      : this.results
    return this
  },
  sorting: function ({ sort, sortby }) {
    return orderBy(this.results, [el => el[sortby].toLowerCase()], [sort])
  }
}

export default () => helper
