(function (global) {
  const schema = global.SessionSchema || {};
  const BACKUP_KEY = 'positioningSession.backup';

  function deepCopy(value) {
    if (value === undefined || value === null) {
      return value;
    }
    return JSON.parse(JSON.stringify(value));
  }

  function buildSessionPayload(state) {
    const safeState = state || {};
    return {
      companyContext: deepCopy(safeState.companyContext || {}),
      segmentData: deepCopy(safeState.segmentData || {}),
      positioningData: deepCopy(safeState.positioningData || {}),
      categoryData: deepCopy(safeState.categoryData || {}),
      aiSuggestions: deepCopy(safeState.aiSuggestions || {}),
      navigationProgress: deepCopy(safeState.navigationProgress || {}),
      currentView: safeState.currentView || 'home',
      lastSaved: safeState.lastSaved || null
    };
  }

  function serializeSession(options) {
    const { getState, appVersion } = options || {};
    if (typeof getState !== 'function') {
      throw new Error('serializeSession requires a getState function.');
    }
    const state = getState();
    if (!state) {
      throw new Error('Application state is unavailable.');
    }
    const data = buildSessionPayload(state);
    return schema.createEnvelope({ appVersion, data });
  }

  function mergeWithInitial(initialState, importedData) {
    const base = deepCopy(initialState || {});
    const incoming = importedData || {};

    const merged = {
      ...base,
      ...incoming,
      companyContext: {
        ...base.companyContext,
        ...(incoming.companyContext || {})
      },
      segmentData: {
        ...deepCopy(base.segmentData),
        ...(incoming.segmentData || {})
      },
      positioningData: {
        ...deepCopy(base.positioningData),
        ...(incoming.positioningData || {})
      },
      categoryData: {
        ...deepCopy(base.categoryData),
        ...(incoming.categoryData || {})
      },
      aiSuggestions: {
        ...deepCopy(base.aiSuggestions),
        ...(incoming.aiSuggestions || {})
      },
      navigationProgress: {
        ...deepCopy(base.navigationProgress),
        ...(incoming.navigationProgress || {}),
        completedParts: Array.isArray(incoming.navigationProgress?.completedParts)
          ? incoming.navigationProgress.completedParts
          : deepCopy(base.navigationProgress?.completedParts || []),
        partCompletionData: {
          ...deepCopy(base.navigationProgress?.partCompletionData || {}),
          ...(incoming.navigationProgress?.partCompletionData || {})
        }
      }
    };

    if (!merged.currentView) {
      merged.currentView = base.currentView || 'home';
    }

    return merged;
  }

  function hydrateSession(options) {
    const { json, replaceState, getInitialState } = options || {};
    const validation = schema.validateEnvelope(json);
    if (!validation.valid) {
      const error = new Error(validation.errors.join(' '));
      error.code = 'INVALID_SESSION_FILE';
      throw error;
    }

    if (typeof replaceState !== 'function') {
      throw new Error('hydrateSession requires a replaceState function.');
    }

    const initialState = typeof getInitialState === 'function' ? getInitialState() : {};
    const mergedState = mergeWithInitial(initialState, json.data);
    replaceState(mergedState);
    return mergedState;
  }

  function backupSession(options) {
    const { getState, appVersion, storageKey } = options || {};
    const key = storageKey || BACKUP_KEY;
    const envelope = serializeSession({ getState, appVersion });
    localStorage.setItem(key, JSON.stringify(envelope));
    return envelope;
  }

  function restoreBackup(options) {
    const key = options?.storageKey || BACKUP_KEY;
    try {
      const saved = localStorage.getItem(key);
      if (!saved) {
        return null;
      }
      return JSON.parse(saved);
    } catch (error) {
      console.warn('Failed to load session backup:', error);
      return null;
    }
  }

  global.SessionManager = {
    serializeSession,
    hydrateSession,
    backupSession,
    restoreBackup,
    buildSessionPayload,
    mergeWithInitial,
    BACKUP_KEY
  };
})(window);
