export const REGISTER_STAGE = 'REGISTER_STAGE';
export const REMOVE_STAGE = 'REMOVE_STAGE';

export function registerStage (reference) {
    return {
        type: REGISTER_STAGE,
        reference
    }
}

export function removeStage (reference) {
    return {
        type: REMOVE_STAGE,
        reference
    }
}
