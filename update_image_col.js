const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src/app/api/admin/fleet/route.ts');
let apiContent = fs.readFileSync(apiPath, 'utf8');

// Update PATCH
apiContent = apiContent.replace(
  `const { password, action, old_asset_id, asset_id, type, model, daily_rent, hourly_rate, client_id, location, new_status } = await request.json();`,
  `const { password, action, old_asset_id, asset_id, type, model, image, daily_rent, hourly_rate, client_id, location, new_status } = await request.json();`
);
apiContent = apiContent.replace(
  `        .update({
          asset_id,
          type,
          model,
          daily_rent: parseInt(daily_rent) || 1200,
          hourly_rate: parseInt(hourly_rate) || 350
        })`,
  `        .update({
          asset_id,
          type,
          model,
          image,
          daily_rent: parseInt(daily_rent) || 1200,
          hourly_rate: parseInt(hourly_rate) || 350
        })`
);

// Update PUT
apiContent = apiContent.replace(
  `const { password, asset_id, type, model, location, hours, daily_rent, hourly_rate } = await request.json();`,
  `const { password, asset_id, type, model, image, location, hours, daily_rent, hourly_rate } = await request.json();`
);
apiContent = apiContent.replace(
  `        model,
        location: location || 'Main Depot',`,
  `        model,
        image,
        location: location || 'Main Depot',`
);

fs.writeFileSync(apiPath, apiContent, 'utf8');

// Update Admin Panel
const adminPath = path.join(__dirname, 'src/app/admin/components/FleetTracking.tsx');
let adminContent = fs.readFileSync(adminPath, 'utf8');

adminContent = adminContent.replace(
  `body: JSON.stringify({ password, ...finalAsset, type: finalAsset.brand, model: \`\${finalAsset.brand}||\${finalAsset.name}||\${finalAsset.image}\` })`,
  `body: JSON.stringify({ password, ...finalAsset, type: finalAsset.brand, model: \`\${finalAsset.brand}||\${finalAsset.name}||\${finalAsset.image}\`, image: finalAsset.image })`
);

adminContent = adminContent.replace(
  `body: JSON.stringify({ password, action: 'edit_details', old_asset_id: editAssetForm.asset_id, ...editAssetForm, type: editAssetForm.brand, model: \`\${editAssetForm.brand}||\${editAssetForm.name}||\${editAssetForm.image}\` })`,
  `body: JSON.stringify({ password, action: 'edit_details', old_asset_id: editAssetForm.asset_id, ...editAssetForm, type: editAssetForm.brand, model: \`\${editAssetForm.brand}||\${editAssetForm.name}||\${editAssetForm.image}\`, image: editAssetForm.image })`
);

// Keep parseAssetData logic the same, just fallback to image field if present
adminContent = adminContent.replace(
  `export const parseAssetData = (asset: any) => {
    let parsedBrand = asset.type || "Unknown";
    let parsedName = "Unknown Model";
    let parsedImg = "/images/company_excavator.jpg";

    if (asset.model) {`,
  `export const parseAssetData = (asset: any) => {
    let parsedBrand = asset.type || "Unknown";
    let parsedName = "Unknown Model";
    let parsedImg = asset.image || "/images/company_excavator.jpg"; // Use native image column if present

    if (asset.model) {`
);

fs.writeFileSync(adminPath, adminContent, 'utf8');

// Update Frontend Page
const frontendPath = path.join(__dirname, 'src/app/fleet/page.tsx');
let frontendContent = fs.readFileSync(frontendPath, 'utf8');

frontendContent = frontendContent.replace(
  `            let parsedImg = "/images/company_excavator.jpg";
            
            if (item.model) {`,
  `            let parsedImg = item.image || "/images/company_excavator.jpg"; // Native image column priority
            
            if (item.model) {`
);

fs.writeFileSync(frontendPath, frontendContent, 'utf8');

console.log('Update complete');
