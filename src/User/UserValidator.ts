import Validator from "../Base/Validator";
import UserEntity from "./UserEntity";

class UserValidator implements Validator<UserEntity> {
    updateDataValid = (data: UserEntity): boolean => {
        return (
            typeof data.ime === 'string' && data.ime.trim() !== '' &&
            typeof data.prezime === 'string' && data.prezime.trim() !== '' &&
            typeof data.email === 'string' && data.email.trim() !== '' &&
            data.godine != null && Number.isInteger(data.godine) && data.godine > 0 &&
            data.id != null && Number.isInteger(data.id) && data.id > 0
        );
    };

    createDataValid = (data: UserEntity): boolean => {
        return (
            typeof data.ime === 'string' && data.ime.trim() !== '' &&
            typeof data.prezime === 'string' && data.prezime.trim() !== '' &&
            typeof data.email === 'string' && data.email.trim() !== '' &&
            data.godine != null && Number.isInteger(data.godine) && data.godine > 0
        );
    };

    idValidator = (data: UserEntity) => (data.id ? true : false);

}


export default UserValidator;