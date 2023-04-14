import {
  readGlucoses,
  readInsulins,
  readLatestGlucose,
  readLatestInsulin,
  updateGlucose,
  updateInsulin,
} from '../../../backend/realm/CRUD';
import {realmOpen} from '../../../backend/realm/utils';

export const HealthService = {
  updataGlucoseData: async () => {
    try {
      const realm = await realmOpen();
      await updateGlucose(realm);
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  updateInsulinData: async () => {
    try {
      const realm = await realmOpen();
      await updateInsulin(realm);
    } catch (e) {
      console.error('Error updating insulin data:', e);
    }
  },
  getInsulindata2: async realm => {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 1); // 1 days ago
      const toDate = new Date(); // today
      let insulinData = await readInsulins(realm, fromDate, toDate);

      if (insulinData === null) {
        await updateInsulin(realm);
        insulinData = await readInsulins(realm);
        if (insulinData === null) {
          return [];
        }
      }
      return insulinData;
    } catch (error) {
      console.log('Error retrieving glucose data:', error);
      return null;
    }
  },

  getGlucoseData2: async realm => {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7); // 7 days ago
      const toDate = new Date(); // today

      let glucoseData = await readGlucoses(realm, fromDate, toDate);

      if (glucoseData === null) {
        console.log(glucoseData, 'glucoseData in service is null');
        await updateGlucose(realm);
        glucoseData = await readGlucoses(realm);
      }

      return glucoseData;
    } catch (error) {
      console.log('Error retrieving glucose data:', error);
      return null;
    }
  },

  getGlucoseData: async ({realm}) => {
    try {
      const glucoseData = await readGlucoses(realm);
      let sortedGlucoseData = glucoseData.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      let limitedGlucoseData = sortedGlucoseData.slice(0, 15);

      await updateGlucose(realm);
      sortedGlucoseData = await readGlucoses(realm).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      limitedGlucoseData = sortedGlucoseData.slice(0, 15);

      return limitedGlucoseData;
    } catch (error) {
      console.log('Error retrieving glucose data:', error);
      return null;
    }
  },

  getInsulinData: async () => {
    try {
      const realm = await realmOpen();
      const InsulinData = await readInsulins(realm);
      let sortedInsulinData = InsulinData.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      let limitedInsulinData = sortedInsulinData.slice(0, 15);
      if (InsulinData !== null) {
        await updateGlucose(realm);
        sortedInsulinData = await readInsulins(realm).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
        limitedInsulinData = sortedInsulinData.slice(0, 15);
      }
      return limitedInsulinData;
    } catch (error) {
      console.log('Error retrieving glucose data:', error);
      return null;
    }
  },
};
