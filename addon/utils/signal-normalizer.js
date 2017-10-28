export default function normalizeSignalName(name) {
    return name.split('.').join('/');
}