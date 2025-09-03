interface Validator<T> {
    updateDataValid: (data: T) => boolean;
    createDataValid: (data: T) => boolean;
    idValidator: (data: T) => boolean;
}

export default Validator;