import { useState, useCallback, useMemo } from 'react';

type Validator<T> = { [K in keyof T]?: (value: string) => string };
type Masker<T> = { [K in keyof T]?: (value: string) => string };
type FormErrors<T> = Record<keyof T | 'general', string>;

// Esse hook é usado para gerenciar o estado de um formulário, incluindo validação, mascaramento de campos e controle de erros.

export function useForm<T extends Record<string, string>>(
    initialValues: T,
    validators: Validator<T> = {},
    maskers: Masker<T> = {},
    requiredFields: Array<keyof T> = []
) {
    // Inicializa o estado do formulário com os valores iniciais fornecidos.
    const [values, setValues] = useState<T>(initialValues);

    // Inicializa o estado de erros do formulário, com um objeto que contém chaves para cada campo e uma chave 'general' para erros gerais.
    const [errors, setErrors] = useState<FormErrors<T>>({
        ...Object.keys(initialValues).reduce(
            (acc, key) => ({ ...acc, [key]: '' }),
            {} as Record<keyof T, string>
        ),
        general: ''
    });

    // Função para atualizar um campo específico do formulário, aplicando uma máscara se fornecida.
    const updateField = useCallback(
        (key: keyof T, value: string) => {
            const masked = maskers[key] ? maskers[key]!(value) : value;
            setValues((prev) => ({ ...prev, [key]: masked }));
            setErrors((prevErrors) => {
                if (prevErrors[key] !== '') {
                    return {
                        ...prevErrors,
                        [key]: '',
                    };
                }
                return prevErrors; 
            });
        },
        [maskers]
    );

    // Função para lidar com o evento de perda de foco em um campo, validando o valor do campo e atualizando os erros.
    const handleBlur = useCallback(
        (key: keyof T) => {
            const valueToValidate = values[key];
            let error = '';
            if (validators[key]) {
                error = validators[key]!(valueToValidate);
            }
            setErrors((prev) => ({
                ...prev,
                [key]: error,
            }));
        },
        [values, validators]
    );

    // Função para validar todos os campos do formulário, retornando um objeto com os erros de cada campo.
    const validateAll = useCallback(() => {
        const newErrors = Object.keys(values).reduce((acc, key) => {
            const k = key as keyof T;
            acc[k] = validators[k] ? validators[k]!(values[k]) : '';
            return acc;
        }, {} as FormErrors<T>);

        const fullNewErrors: FormErrors<T> = {
            ...newErrors,
            general: ''
        };

        setErrors(fullNewErrors);
        return fullNewErrors;
    }, [values, validators]);
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({
            ...Object.keys(initialValues).reduce(
                (acc, key) => ({ ...acc, [key]: '' }),
                {} as Record<keyof T, string>
            ),
            general: ''
        });
    }, [initialValues]);

    // Verifica se todos os campos obrigatórios estão preenchidos e se não há erros nos campos para habilitar o botão de envio.
    const isFormValid = useMemo(() => {
        const allRequiredFieldsFilled = requiredFields.every(
            (key) => values[key] !== '' && values[key] !== undefined
        );

        const noFieldErrors = Object.keys(errors).every((key) => {
            if (key === 'general') return true;
            return errors[key as keyof T] === '';
        });

        return allRequiredFieldsFilled && noFieldErrors;
    }, [values, errors, requiredFields]);

    return {
        values,
        errors,
        updateField,
        handleBlur,
        validateAll,
        resetForm,
        setErrors,
        setValues,
        isFormValid
    };
}