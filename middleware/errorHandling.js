function invalidJsonFormat(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ message: 'Invalid JSON format' });
    }

    console.error('[Unhandled Error]', err);
    res.status(500).send({ message: 'Internal server error' });
}

export default invalidJsonFormat;