(function (global) {
  const schema = global.SessionSchema || {};
  const BACKUP_KEY = 'positioningSession.backup';

  function deepCopy(value) {
    if (value === undefined || value === null) {
      return value;
    }
    return JSON.parse(JSON.stringify(value));
  }

  // Enhanced array merging function to ensure backward compatibility for alternatives structure
  function ensureAlternativesStructure(alternatives) {
    if (!Array.isArray(alternatives)) {
      return [{ val1: '', val2: '', val3: '', val4: '', val5: '' }];
    }
    return alternatives.map(alt => {
      // Handle new enhanced structure with descriptive fields
      if (alt.alternative || alt.description || alt.whyCustomersChoose || alt.weaknessesOrGaps || alt.customerProof) {
        return {
          val1: alt.alternative || '',
          val2: alt.description || '',
          val3: alt.whyCustomersChoose || '',
          val4: alt.weaknessesOrGaps || '',
          val5: alt.customerProof || ''
        };
      }
      // Handle legacy structure
      return {
        val1: alt.val1 || '',
        val2: alt.val2 || '',
        val3: alt.val3 || '',
        val4: alt.val4 || '',
        val5: alt.val5 || ''
      };
    });
  }

  function buildSessionPayload(state) {
    const safeState = state || {};
    const rawSegmentData = safeState.segmentData || {};

    // Organize segment data into logical sub-sections
    const organizeSegmentData = (segmentData) => {
      const jobsToBeDone = {};
      const customerValue = {};
      const willingnessToPay = {};
      const other = {};

      // Jobs to be Done fields
      const jtbdFields = [
        'jobPerformer', 'jobToBeHired', 'currentSituation', 'desiredOutcome',
        'unsuccessfulAttempts', 'currentProcess', 'jobObstacles', 'jobContext',
        'Context', 'Struggling Moments', 'Pushes & Pulls', 'Anxieties & Habits',
        'Desired Outcomes', 'Basic Quality (Table Stakes)', 'Hiring Criteria',
        'Firing Criteria', 'Key Trade-offs'
      ];

      // Customer Value fields
      const customerValueFields = [
        'successMetrics', 'Customer Value', 'Value Metrics', 'Value Proposition',
        'Benefits', 'Outcomes', 'Emotional Benefits', 'Functional Benefits'
      ];

      // Willingness to Pay fields
      const willingnessToPayFields = [
        'Willingness to Pay', 'Price Sensitivity', 'Budget', 'Cost Structure',
        'Pricing Model', 'Payment Terms', 'Economic Value'
      ];

      // Categorize all segment data fields
      Object.keys(segmentData).forEach(key => {
        if (jtbdFields.includes(key)) {
          jobsToBeDone[key] = segmentData[key];
        } else if (customerValueFields.includes(key)) {
          customerValue[key] = segmentData[key];
        } else if (willingnessToPayFields.includes(key)) {
          willingnessToPay[key] = segmentData[key];
        } else {
          other[key] = segmentData[key];
        }
      });

      // Return organized structure with only populated sections
      const result = {};
      if (Object.keys(jobsToBeDone).length > 0) {
        result.jobsToBeDone = jobsToBeDone;
      }
      if (Object.keys(customerValue).length > 0) {
        result.customerValue = customerValue;
      }
      if (Object.keys(willingnessToPay).length > 0) {
        result.willingnessToPay = willingnessToPay;
      }
      if (Object.keys(other).length > 0) {
        result.other = other;
      }

      return result;
    };

    return {
      companyContext: deepCopy(safeState.companyContext || {}),
      segmentData: organizeSegmentData(rawSegmentData),
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

  // Function to flatten organized segment data back to flat structure
  function flattenSegmentData(organizedSegmentData) {
    if (!organizedSegmentData || typeof organizedSegmentData !== 'object') {
      return {};
    }

    const flattened = {};

    // Handle organized structure (jobsToBeDone, customerValue, willingnessToPay, other)
    if (organizedSegmentData.jobsToBeDone) {
      Object.assign(flattened, organizedSegmentData.jobsToBeDone);
    }
    if (organizedSegmentData.customerValue) {
      Object.assign(flattened, organizedSegmentData.customerValue);
    }
    if (organizedSegmentData.willingnessToPay) {
      Object.assign(flattened, organizedSegmentData.willingnessToPay);
    }
    if (organizedSegmentData.other) {
      Object.assign(flattened, organizedSegmentData.other);
    }

    // If it's already flat, return as-is
    if (Object.keys(flattened).length === 0) {
      return organizedSegmentData;
    }

    return flattened;
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
        ...flattenSegmentData(incoming.segmentData || {})
      },
      positioningData: {
        ...deepCopy(base.positioningData),
        ...(incoming.positioningData || {}),
        alternatives: ensureAlternativesStructure(
          incoming.positioningData?.competitiveAlternatives ||
          incoming.positioningData?.alternatives ||
          base.positioningData?.alternatives
        )
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
