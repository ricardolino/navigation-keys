export const REGISTER_STAGE = 'REGISTER_STAGE';

export function registerStage (reference) {
    return {
        type: REGISTER_STAGE,
        reference
    }
}
