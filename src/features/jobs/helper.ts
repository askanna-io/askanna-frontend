export const JobsListHeaders = (isMobile: boolean) => [
  {
    title: 'Name',
    align: 'left',
    sortable: true,
    key: 'name',
    isShowOnMobile: true,
  },

  { title: 'Runs', sortable: false, key: 'suuid', isShowOnMobile: false },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    isShowOnMobile: true,
    width: isMobile ? '65%' : ''
  }
]
