const translateImage= (image: string) => {
    if (image.startsWith('sha256:'))
        return undefined;
    const rawPub = image.replaceAll('http://', '').replaceAll('https://', '').replaceAll('\.\.', '').split('/');
    const name = ((rawPub.length > 1 ? rawPub.pop() : rawPub[0]) || '').split(':')[0];
    const registry = rawPub.length > 1 ? (rawPub.shift()) : undefined
    const publisher = registry === undefined && !image.includes('/') ? undefined : rawPub.join('/').split(':')[0]
    return {
        registry: registry,
        publisher,
        name
    }
}

export { translateImage } ;