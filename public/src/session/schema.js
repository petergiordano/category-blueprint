(function (global) {
  const FORMAT_VERSION = '1.0.0';
  const DEFAULT_APP_VERSION = '1.0.0';

  function createEnvelope(options) {
    const { appVersion, data } = options || {};
    if (!data || typeof data !== 'object') {
      throw new Error('Session envelope requires a data object.');
    }
    return {
      formatVersion: FORMAT_VERSION,
      appVersion: appVersion || DEFAULT_APP_VERSION,
      exportTimestamp: new Date().toISOString(),
      data
    };
  }

  function validateEnvelope(envelope) {
    const errors = [];
    if (!envelope || typeof envelope !== 'object') {
      errors.push('File is not a valid session export.');
      return { valid: false, errors };
    }

    if (!('formatVersion' in envelope)) {
      errors.push('Missing formatVersion in session file.');
    } else if (envelope.formatVersion !== FORMAT_VERSION) {
      errors.push(`Unsupported formatVersion: ${envelope.formatVersion}. Expected ${FORMAT_VERSION}.`);
    }

    if (!envelope.data || typeof envelope.data !== 'object') {
      errors.push('Missing data block in session file.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  global.SessionSchema = {
    FORMAT_VERSION,
    DEFAULT_APP_VERSION,
    createEnvelope,
    validateEnvelope
  };
})(window);
