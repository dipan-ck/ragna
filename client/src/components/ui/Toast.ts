
import toast from 'react-hot-toast';


export function SuccessToast(message : string){
  return toast.success(message);
}


export function ErrorToast(message: string){
  return toast.error(message)
}