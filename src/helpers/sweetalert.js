import Swal from 'sweetalert2'
export const successAdd = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const successUpdate = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const successDelete = (item) => {
    Swal.fire({
        icon: 'success',
        title: item,
        showConfirmButton: false,
        timer: 1800
    })
}
export const errorAdd = (err) => {
    Swal.fire({
        icon: 'error',
        text: err,
        showConfirmButton: false,
        timer: 1800
    })
}