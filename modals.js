angular.module('splatApp').controller('ModalCtrl', function($scope, $uibModal, $log) {
  $scope.animationsEnabled = true;


  var templates = {
    "weaponPicker" : `<div class="row">
            <div class="col-md-12">
              <div class="weapon neonstripes">
              <div class="row cardheader">
                <div class="col-md-6">
                  <select class="form-control dropdown-toggle" data-ng-options="x.type for x in weaponSets" data-ng-model="selectedSet" ng-change="switchSet()"></select>
                </div>
                <div class="col-md-6">
                  <select class="form-control dropdown-toggle" data-ng-options="x.name for x in availableWeapons()" data-ng-model="selectedWeapon"></select>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-5" style="min-height:180px" align="center">
                  <img fallback-img class="weaponicon " style="max-height:200px; width: auto;" ng-src="{{selectedWeapon.image}}"/>
                </div>
              <div class="col-xs-7" align="center">
                <img fallback-img ng-src="{{getSubIcon(selectedWeapon.sub)}}" uib-tooltip="{{selectedWeapon.sub}}" tooltip-placement="top" style="background:rgba(0,0,0,0.5); border-radius:8px; height:48px" />
                <img fallback-img ng-src="img/subspe/Wsp_Jetpack.png" uib-tooltip="{{selectedWeapon.sub}}" tooltip-placement="top" style="background:rgba(0,0,0,0.5); border-radius:8px; height:48px"  />
                <br>
                <span class="splatfont-white">{{selectedWeapon.specialCost}}p</span><br>
                  more stats blah blah
              </div>
            </div>
              <div class="row">
                <div class="col-xs-6">
                  <button class="btn" type="button" ng-click="ok()">OK</button>
                </div>
                <div class="col-xs-6">
                <button class="btn" type="button" ng-click="cancel()">Cancel</button>
                </div>
            </div>
          </div>
        </div>`
  }

  $scope.openWeaponPicker = function(size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      template: templates["weaponPicker"],
      windowTemplateUrl: 'blankModal.html',
      controller: 'WeaponPickerCtrl',
      size: size,
      resolve: {
        selectedSet: function() {
          return $scope.selectedSet;
        },
        weaponSets: function() {
          return $scope.weaponSets;
        },
        subs: function() {
          return $scope.subs;
        },
        selectedWeapon: function() {
          return $scope.loadout.weapon;
        }
      }
    });

    modalInstance.result.then(function(results) {
      $scope.selectedSet=results.set;
      $scope.loadout.weapon=results.weapon;
    }, function() {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function() {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('splatApp').controller('WeaponPickerCtrl', function($scope, $uibModalInstance, weaponSets, subs, selectedSet, selectedWeapon) {
  $scope.selectedSet = selectedSet;
  $scope.weaponSets = weaponSets;
  $scope.selectedWeapon = selectedWeapon;

  $scope.switchSet = function() {
    this.selectedWeapon = this.availableWeapons()[0];
  }

  $scope.availableWeapons = function() {
    return this.selectedSet.weapons.filter(filter_available)
  }

  $scope.getSubByName = function(name) {
      return subs.filter(function(sub) {
        return sub.name == name;
      })[0]
  }

  $scope.getSubIcon = function(name) {
    return $scope.getSubByName(name).image;
  }

  $scope.ok = function() {
    console.log(this.selectedWeapon)
    $uibModalInstance.close({'set' : this.selectedSet, 'weapon': this.selectedWeapon});
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});