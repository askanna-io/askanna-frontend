
export default function () {
    const roles = {
        admin: {
            title: 'Workspace admin',
            code: 'WA'
        },
        member: {
            title: 'Workspace member',
            code: 'WM'
        },
        viewer: {
            title: 'Workspace viewer',
            code: 'WV'
        },
    }

    return { roles }
}