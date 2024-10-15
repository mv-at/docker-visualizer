const translateImage= (image: string) => {
    if (image.startsWith('sha256:'))
        return undefined;
    const rawPub = image.replaceAll('http://', '').replaceAll('https://', '').replaceAll('\.\.', '').split('/');
    const name = ((rawPub.length > 1 ? rawPub.pop() : rawPub[0]) || '').split(':')[0];
    const registry = rawPub.length > 1 ? (rawPub.shift() || 'dockerhub') : 'dockerhub'
    const publisher = rawPub.join('/').split(':')[0]
    return {
        registry,
        publisher,
        name
    }
}

export { translateImage } ;