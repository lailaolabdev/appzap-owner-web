import Swal from 'sweetalert2'
export const successAdd = () => {
    Swal.fire({
        icon: 'success',
        title: 'Add is Success',
        showConfirmButton: false,
        timer: 1800
    })
}
export const successUpdate = () => {
    Swal.fire({
        icon: 'success',
        title: 'Update Is Success',
        showConfirmButton: false,
        timer: 1800
    })
}
export const successDelete = () => {
    Swal.fire({
        icon: 'success',
        title: 'Delete Is Success',
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