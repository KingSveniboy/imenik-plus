import Validator from "../Base/Validator";
import { PostEntity } from "./PostEntity";

//  id?: number;
//   naslov: string;
//   sadrzaj: string;
//   created_at?: Date;
//   updated_at?: Date;
//   user_id: number;

class PostValidator implements Validator<PostEntity> {
  updateDataValid = (data: PostEntity): boolean => {
    return (
      typeof data.naslov === 'string' && data.naslov.trim() !== '' &&
      typeof data.sadrzaj === 'string' && data.sadrzaj.trim() !== '' &&
      data.userId != null && Number.isInteger(data.userId) && data.userId > 0 &&
      data.updatedAt instanceof Date && !isNaN(data.updatedAt.getTime()) &&
      data.id != null && Number.isInteger(data.id) && data.id > 0
    );
  };

  createDataValid = (data: PostEntity): boolean => {
    return (
      typeof data.naslov === 'string' && data.naslov.trim() !== '' &&
      typeof data.sadrzaj === 'string' && data.sadrzaj.trim() !== '' &&
      data.userId != null && Number.isInteger(data.userId) && data.userId > 0
    );
  };

  idValidator = (data: PostEntity) => (data.id ? true : false);

}


export default PostValidator;